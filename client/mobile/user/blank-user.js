import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    Text, TouchableOpacity
} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";
import logoIcon from "../assets/auramaze-logo.png";
import SignUpPage from "./sign-up-page";
import LogInPage from "./log-in-page";

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

class BlankUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {pageIsSign: true};
        this.createAuraMaze = this.createAuraMaze.bind(this);
    }


    createAuraMaze() {
        this.setState(previousState => ({auramazeProcessing: true}));
        let bodyObject = JSON.stringify({
            name: {default: this.state.name},
            email: this.state.email,
            password: this.state.password
        });
        fetch('https://apidev.auramaze.org/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: bodyObject
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Create account fail.');
            }
        }).then(function (myJson) {
            alert(JSON.stringify(myJson));
            this.setState(previousState => ({auramazeProcessing: false}));
        }).catch(function (error) {
            this.setState(previousState => ({auramazeProcessing: false}));
            alert('There has been a problem with your fetch operation: ' + error.message);
        });
    };

    render() {

        let fontLoadStatus = this.props.screenProps.fontLoaded;

        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1, flexDirection: 'column',
                alignItems: 'center'
            },
            signupText: {
                color: '#666666',
                textAlign: 'center',
                paddingHorizontal: 10,
                fontSize: 15
            },
            signupScreenButton: {
                width: Dimensions.get('window').width * 2 / 3,
                marginRight: 40,
                marginLeft: 40,
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: 'white',
                // borderWidth: 1,
                borderColor: '#666666',
                borderRadius: 5
            },
        });

        let _onPressButton = () => {
            this.setState(previousState => ({pageIsSign: !previousState.pageIsSign}));
        };

        return (
            <DismissKeyboard>
                <View style={styles.mainStruct}>

                    <AutoHeightImage width={Dimensions.get('window').width * 2 / 7}
                                     source={logoIcon}
                                     style={{marginTop: 80, marginBottom: 30}}/>

                    {this.state.pageIsSign ? <SignUpPage/> : <LogInPage/>}

                    <TouchableOpacity
                        style={styles.signupScreenButton}
                        onPress={_onPressButton}
                        underlayColor='#fff'>
                        <Text style={styles.signupText}>
                            {this.state.pageIsSign === true ?
                                "Already have an account? Log In" :
                                "No account? Sign up"}
                        </Text>
                    </TouchableOpacity>

                </View>
            </DismissKeyboard>
        );
    }
}

export default BlankUser;
