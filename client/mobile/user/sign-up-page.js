import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    TouchableOpacity,
} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";
import logoIcon from "../assets/auramaze-logo.png";
import google from '../assets/icons/google.png';
import facebook from '../assets/icons/facebook.png';
import {Input} from "react-native-elements";
import Hr from 'react-native-hr-plus';
import config from "../config.json";
import {withAuth} from "../App";

class SignUpPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this._createAuraMaze = this._createAuraMaze.bind(this);
        this._setSignUpData = this._setSignUpData.bind(this);
    }

    checkValid() {
        if (!this.state.email) {
            alert("Invalid email!");
            return false;
        }
        if (!this.state.password || !/^[A-Za-z0-9#?!@$%^&*-]{4,}$/.test(this.state.password)) {
            alert("Invalid password!");
            return false;
        }
        return true;
    }

    _createAuraMaze() {
        if (!this.checkValid()) return;
        let bodyObject = JSON.stringify({
            name: {default: this.state.name},
            email: this.state.email,
            password: this.state.password
        });

        fetch(`${config.API_ENDPOINT}/auth/signup`, {
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
                Promise.reject(response.json());
                throw new Error('Create account fail.');
            }
        }).then((responseJson) => this._setSignUpData(responseJson)
        ).catch(function (error) {
            alert('There has been a problem with your fetch operation: ' + error.message);
        });
    };

    _logFacebook = async () => {
        try {
            const {
                type,
                token,
                expires,
                permissions,
                declinedPermissions,
            } = await Expo.Facebook.logInWithReadPermissionsAsync(config.FACEBOOK_APP_ID, {
                permissions: ['public_profile']
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.width(250)`);
                const profile = await response.json();
                const auth = await fetch(`${config.API_ENDPOINT}/auth/facebook/mobile`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(profile)
                });
                if (auth.ok) {
                    const authJson = await auth.json();
                    this._setSignUpData(authJson).done();
                } else {
                    throw new Error('Facebook auth fail.');
                }
            } else {
                // type === 'cancel'
            }
        } catch ({message}) {
            alert(`Facebook Login Error: ${message}`);
        }
    };

    _logGoogle = async () => {
        try {
            const result = await Expo.Google.logInAsync({
                androidClientId: config.GOOGLE_ANDROID_CLIENT_ID,
                iosClientId: config.GOOGLE_IOS_CLIENT_ID,
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                    headers: { Authorization: `Bearer ${result.accessToken}`},
                });
                const profile = await response.json();
                const auth = await fetch(`${config.API_ENDPOINT}/auth/google/mobile`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(profile)
                });
                if (auth.ok) {
                    const authJson = await auth.json();
                    this._setSignUpData(authJson).done();
                } else {
                    throw new Error('Google auth fail.');
                }
            } else {
                // type === 'cancel'
            }
        } catch ({message}) {
            alert(`Google Login Error: ${message}`);
        }
    };

    _setSignUpData = async (responseJson) => {
        await this.props.auth.createAuth(responseJson.id, responseJson.token);
    };


    render() {

        return (
            <View style={styles.mainStruct}>
                <View style={styles.inputHolder}>
                    <Input placeholder='Name'
                           inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                           onChangeText={(username) => this.setState({name: username})}/>
                    <Input placeholder='Email'
                           inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                           onChangeText={(email) => this.setState({email: email})}/>
                    <Input placeholder='Password'
                           secureTextEntry={true}
                           inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                           onChangeText={(password) => this.setState({password: password})}/>
                </View>

                <TouchableOpacity
                    style={[styles.buttonGeneral, styles.buttonAuramaze]}
                    onPress={this._createAuraMaze}
                    underlayColor='#fff'>
                    <AutoHeightImage width={20} source={logoIcon} style={{tintColor: 'white'}}/>
                    <Text style={[styles.textGenreal, styles.textWhite]}>Create AuraMaze account</Text>
                </TouchableOpacity>

                <Hr color='#666666' width={1} style={{paddingHorizontal: 20}}>
                    <Text style={styles.textWithDivider}>OR</Text>
                </Hr>

                <TouchableOpacity
                    style={[styles.buttonGeneral, styles.buttonGoogle]}
                    onPress={this._logGoogle}
                    underlayColor='#fff'>
                    <AutoHeightImage width={20} source={google}/>
                    <Text style={[styles.textGenreal, styles.textBlack]}>Sign up with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buttonGeneral, styles.buttonFacebook]}
                    onPress={this._logFacebook}
                    underlayColor='#fff'>
                    <AutoHeightImage width={20} source={facebook}/>
                    <Text style={[styles.textGenreal, styles.textWhite]}>Sign up with Facebook</Text>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainStruct: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    inputHolder: {
        width: Dimensions.get('window').width,
        alignItems: 'center', justifyContent: 'center'
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
    signupScreenButton: {
        width: Dimensions.get('window').width * 2 / 3,
        marginRight: 40, marginLeft: 40,
        paddingTop: 10, paddingBottom: 10,
        backgroundColor: 'white',
        borderColor: '#666666',
        borderRadius: 5
    },
    textGenreal: {
        textAlign: 'center',
        paddingHorizontal: 10,
        fontSize: 15
    },
    textWhite: {color: 'white'},
    textBlack: {color: 'black'},
    signupText: {
        color: '#666666',
        textAlign: 'center',
        fontSize: 15
    }
});

export default withAuth(SignUpPage);
