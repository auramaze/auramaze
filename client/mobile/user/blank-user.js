import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    Text, TouchableOpacity, AsyncStorage
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
        this.state = {pageIsSign: true, hasAuthorized: false};
    }

    componentDidMount() {

        AsyncStorage.getItem('isAuthorized', null).then((value) => {
            if (value === undefined || value === 'false') {
                AsyncStorage.multiSet([
                    ['isAuthorized', 'false'],
                    ["username", 'undefined'],
                    ["token", 'undefined'],
                    ["id", 'undefined'],
                ]);
                this.setState({hasAuthorized: false});
            } else {
                this.setState({hasAuthorized: true});
            }
        });
    };

    render() {

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
                borderColor: '#666666',
                borderRadius: 5
            },
        });

        let _onPressButton = () => {
            this.setState(previousState => ({pageIsSign: !previousState.pageIsSign}));
        };

        let _checkStatus = () => {
            AsyncStorage.multiGet(['isAuthorized', 'username', 'token', 'id']).then((data) => {
                let isAuthorized = data[0][1];
                let username = data[1][1];
                let token = data[2][1];
                let id = data[3][1];
                alert("isAuthorized: " + isAuthorized
                    + "\nusername: " + username
                    + "\ntoken: " + token
                    + "\nid: " + id)
            });
        };

        return (
            <DismissKeyboard>
                <View style={styles.mainStruct}>

                    <TouchableOpacity
                        onPress={_checkStatus}>
                        <AutoHeightImage width={Dimensions.get('window').width * 2 / 7}
                                         source={logoIcon}
                                         style={{
                                             marginTop: Dimensions.get('window').width * 80 / 375,
                                             marginBottom: 30
                                         }}/>
                    </TouchableOpacity>

                    {this.state.pageIsSign ?
                        <SignUpPage screenProps={{toLogIn: this.props.screenProps.toLogIn}}/> :
                        <LogInPage screenProps={{toLogIn: this.props.screenProps.toLogIn}}/>}

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
