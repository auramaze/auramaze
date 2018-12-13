import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    Text, TouchableOpacity,
    ScrollView
} from 'react-native';
import {Input} from "react-native-elements";
import {ImageManipulator, ImagePicker, Permissions} from 'expo';
import AutoHeightImage from "react-native-auto-height-image";
import logoIcon from "../assets/auramaze-logo.png";
import config from "../config";
import {withAuth} from "../App";
import {withNavigation} from 'react-navigation';
import WebLinks from './web-links';
import noImage from '../assets/icons/no-image-artizen.png';
import {checkResponseStatus} from "../utils";
import google from "../assets/icons/google.png";
import facebook from "../assets/icons/facebook.png";

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

class UserSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editProfile: false,
            changePassword: false,
            name: null,
            username: null,
            email: null,
            avatar: null,
            google: null,
            facebook: null,
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
            avatarImage: null
        };
    }

    async componentDidMount() {
        await this.fetchUserInfo();
    };

    fetchUserInfo = async () => {
        const {id} = this.props.auth;

        if (id) {
            const response = await fetch(`${config.API_ENDPOINT}/artizen/${id}`);
            const responseJson = await response.json();
            const {name, username, email, avatar, google, facebook} = responseJson;
            this.setState({name, username, email, avatar, google, facebook});
        }
    };

    toggleEditProfile = () => {
        if (this.state.editProfile) {
            this.setState({editProfile: false});
        } else {
            this.setState({changePassword: false, editProfile: true});
        }
    };

    toggleChangePassword = () => {
        if (this.state.changePassword) {
            this.setState({changePassword: false});
        } else {
            this.setState({editProfile: false, changePassword: true});
        }
    };

    editProfile = async () => {
        const {id, token} = this.props.auth;
        const {name, username, email} = this.state;
        const body = {name, username, email};
        if (this.state.avatarImage) {
            body.avatar_image = this.state.avatarImage;
        }
        const response = await fetch(`${config.API_ENDPOINT}/artizen/${id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        if (await checkResponseStatus(response, this.props.auth.removeAuth)) {
            alert('Edit profile success!');
            const refreshUserIndex = this.props.navigation.getParam('refreshUserIndex', async () => {
            });
            await refreshUserIndex();
        } else {
            alert('Unable to edit profile!');
        }
    };

    changePassword = async () => {
        const {id, token} = this.props.auth;
        const {oldPassword, newPassword} = this.state;
        const response = await fetch(`${config.API_ENDPOINT}/artizen/${id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({old_password: oldPassword, password: newPassword})
        });
        if (await checkResponseStatus(response, this.props.auth.removeAuth)) {
            alert('Change password success!');
        } else {
            alert('Unable to change password!');
        }
    };

    _pickImage = async () => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
            });

            const manipResult = await ImageManipulator.manipulate(
                result.uri,
                [{resize: {width: 200, height: 200}}],
                {base64: true}
            );

            this.setState({avatar: manipResult.uri, avatarImage: manipResult.base64});
        } else {
            alert('Please go to Settings to enable access to photo!');
        }
    };

    _bindGoogle = async () => {
        const authToken = this.props.auth.token;

        const result = await Expo.Google.logInAsync({
            androidClientId: config.GOOGLE_ANDROID_CLIENT_ID,
            androidStandaloneAppClientId: config.GOOGLE_ANDROID_STANDALONE_APP_CLIENT_ID,
            iosClientId: config.GOOGLE_IOS_CLIENT_ID,
            iosStandaloneAppClientId: config.GOOGLE_IOS_STANDALONE_APP_CLIENT_ID,
            scopes: ['profile', 'email'],
        });

        if (result.type === 'success') {
            const auth = await fetch(`${config.API_ENDPOINT}/bind/google`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({access_token: result.accessToken})
            });
            if (!auth.ok) {
                alert('Google Bind Error');
                return;
            }
            this.setState({google: true});
        } else {
            // type === 'cancel'
        }
    };

    _bindFacebook = async () => {
        const authToken = this.props.auth.token;

        const {
            type,
            token
        } = await Expo.Facebook.logInWithReadPermissionsAsync(config.FACEBOOK_APP_ID, {
            permissions: ['public_profile']
        });
        if (type === 'success') {
            const auth = await fetch(`${config.API_ENDPOINT}/bind/facebook`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({access_token: token})
            });
            if (!auth.ok) {
                alert('Facebook Bind Error');
                return;
            }
            this.setState({facebook: true});
        } else {
            // type === 'cancel'
        }
    };

    render() {
        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1, flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                paddingVertical: Dimensions.get('window').height / 20
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
            buttonGeneral: {
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('window').width - 40,
                height: 45,
                marginVertical: 10,
                borderWidth: 1
            },
            buttonGoogle: {
                backgroundColor: 'white',
                borderColor: '#666666'
            },
            buttonFacebook: {
                backgroundColor: '#3B5998',
                borderColor: '#3B5998'
            },
            buttonSubmit: {
                backgroundColor: '#666666',
                borderColor: '#666666',
                marginVertical: 20
            },
            buttonEdit: {
                backgroundColor: '#666666',
                borderColor: '#666666'
            },
            buttonLogOut: {
                backgroundColor: 'tomato',
                borderColor: 'tomato'
            },
            textGeneral: {
                textAlign: 'center',
                paddingHorizontal: 10,
                fontSize: 15
            },
            textWhite: {color: 'white'},
            textBlack: {color: 'black'},
            inputHolder: {
                width: Dimensions.get('window').width,
                alignItems: 'center', justifyContent: 'center'
            },
            inputPofile: {
                marginBottom: 10
            }
        });

        return (
            <DismissKeyboard>
                <ScrollView>
                    <View style={styles.mainStruct}>
                        {this.state.editProfile &&
                        <View style={styles.mainStruct}>
                            <View style={styles.inputHolder}>
                                <TouchableOpacity
                                    onPress={this._pickImage}
                                    underlayColor='#fff'>
                                    <AutoHeightImage width={Dimensions.get('window').width * 2 / 7}
                                                     source={this.state.avatar ? {uri: this.state.avatar} : noImage}
                                                     style={{
                                                         marginBottom: 10,
                                                         borderRadius: Dimensions.get('window').width * 14 / 750
                                                     }}/>
                                </TouchableOpacity>
                                <Input containerStyle={styles.inputPofile}
                                       label='Name: '
                                       placeholder='Name'
                                       value={this.state.name && this.state.name.default}
                                       inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                                       onChangeText={(name) => {
                                           this.setState(prevState => ({name: Object.assign(prevState.name || {}, {default: name})}));
                                       }}/>
                                <Input containerStyle={styles.inputPofile}
                                       label='Username: '
                                       placeholder='Username'
                                       value={this.state.username}
                                       inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                                       onChangeText={(username) => this.setState({username: username})}/>
                                <Input containerStyle={styles.inputPofile}
                                       label='Email: '
                                       placeholder='Email'
                                       value={this.state.email}
                                       inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                                       onChangeText={(email) => this.setState({email: email})}/>
                            </View>

                            <TouchableOpacity
                                style={[styles.buttonGeneral, styles.buttonSubmit]}
                                onPress={this.editProfile}
                                underlayColor='#fff'>
                                <Text style={[styles.textGenreal, styles.textWhite]}>Submit</Text>
                            </TouchableOpacity>
                        </View>}

                        {this.state.changePassword &&
                        <View style={styles.mainStruct}>
                            <View style={styles.inputHolder}>
                                <Input placeholder='Old password'
                                       secureTextEntry={true}
                                       value={this.state.oldPassword}
                                       inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                                       onChangeText={(oldPassword) => this.setState({oldPassword})}/>
                                <Input placeholder='New password'
                                       secureTextEntry={true}
                                       value={this.state.newPassword}
                                       inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                                       onChangeText={(newPassword) => this.setState({newPassword})}/>
                                <Input placeholder='Confirm new password'
                                       secureTextEntry={true}
                                       value={this.state.newPasswordConfirm}
                                       inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                                       onChangeText={(newPasswordConfirm) => this.setState({newPasswordConfirm})}/>
                            </View>

                            <TouchableOpacity
                                style={[styles.buttonGeneral, styles.buttonSubmit]}
                                onPress={this.changePassword}
                                underlayColor='#fff'>
                                <Text style={[styles.textGenreal, styles.textWhite]}>Submit</Text>
                            </TouchableOpacity>
                        </View>}

                        <TouchableOpacity
                            style={[styles.buttonGeneral, styles.buttonEdit]}
                            onPress={this.toggleEditProfile}
                            underlayColor='#fff'>
                            <Text style={[styles.textGeneral, styles.textWhite]}>Edit Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.buttonGeneral, styles.buttonEdit]}
                            onPress={this.toggleChangePassword}
                            underlayColor='#fff'>
                            <Text style={[styles.textGeneral, styles.textWhite]}>Change Password</Text>
                        </TouchableOpacity>

                        {this.state.google ?
                            <View
                                style={[styles.buttonGeneral, styles.buttonGoogle]}>
                                <AutoHeightImage width={20} source={google}/>
                                <Text style={[styles.textGeneral, styles.textBlack]}>Google Associated</Text>
                            </View> :
                            <TouchableOpacity
                                style={[styles.buttonGeneral, styles.buttonGoogle]}
                                onPress={this._bindGoogle}
                                underlayColor='#fff'>
                                <AutoHeightImage width={20} source={google}/>
                                <Text style={[styles.textGeneral, styles.textBlack]}>Enable Login with Google</Text>
                            </TouchableOpacity>}

                        {this.state.facebook ?
                            <View
                                style={[styles.buttonGeneral, styles.buttonFacebook]}>
                                <AutoHeightImage width={20} source={facebook}/>
                                <Text style={[styles.textGeneral, styles.textWhite]}>Facebook Associated</Text>
                            </View> :
                            <TouchableOpacity
                                style={[styles.buttonGeneral, styles.buttonFacebook]}
                                onPress={this._bindFacebook}
                                underlayColor='#fff'>
                                <AutoHeightImage width={20} source={facebook}/>
                                <Text style={[styles.textGeneral, styles.textWhite]}>Enable Login with Facebook</Text>
                            </TouchableOpacity>}

                        <TouchableOpacity
                            style={[styles.buttonGeneral, styles.buttonLogOut]}
                            onPress={async () => {
                                await this.props.auth.removeAuth();
                                this.props.navigation.popToTop();
                            }}
                            underlayColor='#fff'>
                            <Text style={[styles.textGeneral, styles.textWhite]}>Log Out</Text>
                        </TouchableOpacity>
                        <View style={{height: 20}}/>
                        <WebLinks/>
                    </View>
                </ScrollView>
            </DismissKeyboard>
        );
    }
}

export default withNavigation(withAuth(UserSettings));
