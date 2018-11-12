import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Text,
    TouchableOpacity,
    Keyboard,
    AsyncStorage
} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";
import logoIcon from "../assets/auramaze-logo.png";
import google from '../icons/google.png';
import facebook from '../icons/facebook.png';
import {Input} from "react-native-elements";
import Hr from 'react-native-hr-plus';

class LogInPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.logAuraMaze = this.logAuraMaze.bind(this);
    }

    static _onPressButton() {
        alert("asd");
    };

    logAuraMaze() {
        this.setState(previousState => ({auramazeProcessing: true}));
        let bodyObject = JSON.stringify({
            email: this.state.email,
            password: this.state.password
        });
        fetch('https://apidev.auramaze.org/v1/auth/login', {
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
                throw new Error('Log in fail.');
            }
        }).then(function (myJson) {
            alert(JSON.stringify(myJson));
            this.setState(previousState => ({auramazeProcessing: false}));
        }).catch(function (error) {
            this.setState(previousState => ({auramazeProcessing: false}));
            alert('There has been a problem with your fetch operation: ' + error.message);
        });
    };

    static _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('key');
            if (value !== null) {
                // We have data!!
                alert(value);
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    render() {

        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1, flexDirection: 'column',
                alignItems: 'center'
            },
            textWithDivider: {
                color: '#666666',
                paddingHorizontal: 10
            },
            buttonGeneral: {
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('window').width - 40,
                height: 45,
                marginVertical: 10,
                borderWidth: 1
                // borderRadius: 3
            },
            buttonAuramaze: {
                backgroundColor: '#666666',
                borderColor: '#666666'
            },
            buttonGoogle: {
                backgroundColor: 'white',
                borderColor: '#666666'
            },
            buttonFacebook: {
                backgroundColor: '#3B5998',
                borderColor: '#3B5998'
            },
            loginScreenButton: {
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
            textGenreal: {
                textAlign: 'center',
                paddingHorizontal: 10,
                fontSize: 15
            },
            textAuramaze: {
                color: 'white'
            },
            textGoogle: {
                color: 'black'
            },
            textFacebook: {
                color: 'white'
            },
            loginText: {
                color: '#666666',
                textAlign: 'center',
                paddingHorizontal: 10,
                fontSize: 15
            }
        });

        return (
            <View>
                <View style={{
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Input placeholder='Email'
                           inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                           onChangeText={(email) => this.setState(previousState => ({email: email}))}
                    />
                    <Input placeholder='Password'
                           inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                           onChangeText={(password) => this.setState(previousState => ({password: password}))}
                           containerStyle={{marginBottom: 10}}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.buttonGeneral, styles.buttonAuramaze]}
                    onPress={this.logAuraMaze}
                    underlayColor='#fff'>
                    <AutoHeightImage
                        width={20}
                        source={logoIcon} style={{tintColor: 'white'}}/>
                    <Text style={[styles.textGenreal, styles.textAuramaze]}>Log in with AuraMaze account</Text>
                </TouchableOpacity>

                <Hr color='#666666' width={1} style={{paddingHorizontal: 20}}>
                    <Text style={styles.textWithDivider}>OR</Text>
                </Hr>

                <TouchableOpacity
                    style={[styles.buttonGeneral, styles.buttonGoogle]}
                    onPress={LogInPage._retrieveData}
                    underlayColor='#fff'>
                    <AutoHeightImage
                        width={20}
                        source={google}/>
                    <Text style={[styles.textGenreal, styles.textGoogle]}>Log in with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buttonGeneral, styles.buttonFacebook]}
                    onPress={LogInPage._onPressButton}
                    underlayColor='#fff'>
                    <AutoHeightImage
                        width={20}
                        source={facebook}/>
                    <Text style={[styles.textGenreal, styles.textFacebook]}>Log in with Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.loginScreenButton}
                    onPress={LogInPage._onPressButton}
                    underlayColor='#fff'>
                    <Text style={styles.loginText}>Don't have an account, Sign up</Text>
                </TouchableOpacity>

            </View>
        );
    }
}


export default LogInPage;
