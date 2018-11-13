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
import UserIndex from "./user-index";

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
        // AsyncStorage.getItem('isAuthorized',
        //     (value) => {
        //         if (value === undefined) {
        //             AsyncStorage.setItem('isAuthorized', 'false');
        //             this.setState({hasAuthorized: false});
        //         } else {
        //             this.setState({hasAuthorized: value});
        //         }
        //     });

        AsyncStorage.getItem('isAuthorized').then((value) => {
            if (value === undefined) {
                AsyncStorage.setItem('isAuthorized', 'false');
                this.setState({hasAuthorized: false});
            } else {
                this.setState({hasAuthorized: value});
            }
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
                borderColor: '#666666',
                borderRadius: 5
            },
        });

        let _onPressButton = () => {
            this.setState(previousState => ({pageIsSign: !previousState.pageIsSign}));
        };

        let _checkStatus = () => {
            AsyncStorage.getItem('isAuthorized').then((value) => {
                alert(value);
            });
        };

        if (this.state.hasAuthorized !== 'true') {
            return (
                <DismissKeyboard>
                    <View style={styles.mainStruct}>

                        <TouchableOpacity
                            onPress={_checkStatus}>
                            <AutoHeightImage width={Dimensions.get('window').width * 2 / 7}
                                             source={logoIcon}
                                             style={{marginTop: 80, marginBottom: 30}}/>
                        </TouchableOpacity>

                        {this.state.pageIsSign ?
                            <SignUpPage screenProps={{toLogIn: () => this.setState({hasAuthorized: 'true'})}}/> :
                            <LogInPage screenProps={{toLogIn: () => this.setState({hasAuthorized: 'true'})}}/>}

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
        } else {
            return (
                <UserIndex screenProps={{toLogOut: () => this.setState({hasAuthorized: 'false'})}}/>
            )
        }


    }
}

export default BlankUser;
