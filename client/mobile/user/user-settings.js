import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    Text, TouchableOpacity
} from 'react-native';
import {Input} from "react-native-elements";
import {ImagePicker, Permissions} from 'expo';
import AutoHeightImage from "react-native-auto-height-image";
import logoIcon from "../assets/auramaze-logo.png";
import config from "../config";
import {withAuth} from "../App";
import {withNavigation} from 'react-navigation';

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
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
        };
    }

    componentDidMount() {
        const {id} = this.props.auth;
        if (id) {
            fetch(`${config.API_ENDPOINT}/artizen/${id}`).then(response => response.json()).then(responseJson => {
                this.setState({
                    name: responseJson.name,
                    username: responseJson.username,
                    email: responseJson.email,
                    avatar: responseJson.avatar,
                });
            });
        }
    };

    async fetchUserInfo() {
        const {id} = this.props.auth;

        if (id) {
            const response = await fetch(`${config.API_ENDPOINT}/artizen/${id}`);
            const responseJson = await response.json();
            this.setState({avatar: responseJson.avatar});
        }
    }

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
        const response = await fetch(`${config.API_ENDPOINT}/artizen/${id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({name, username, email})
        });
        if (response.ok) {
            alert('Edit profile success!');
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
        if (response.ok) {
            alert('Change password success!');
        } else {
            alert('Unable to change password!');
        }
    };

    _pickImage = async () => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        console.log(status);
        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                base64: true,
                quality: 0.5,
            });

            console.log(result);
        }

        // if (!result.cancelled) {
        //     this.setState({ image: result.uri });
        // }
    };

    render() {
        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1, flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
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
                <View style={styles.mainStruct}>
                    {this.state.editProfile &&
                    <View style={styles.mainStruct}>
                        <View style={styles.inputHolder}>
                            <TouchableOpacity
                                onPress={this._pickImage}
                                underlayColor='#fff'>
                                <AutoHeightImage width={Dimensions.get('window').width * 2 / 7}
                                                 source={this.state.avatar ? {uri: this.state.avatar} : logoIcon}
                                                 style={{
                                                     marginBottom: 10,
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

                    <TouchableOpacity
                        style={[styles.buttonGeneral, styles.buttonLogOut]}
                        onPress={async () => {
                            await this.props.auth.removeAuth();
                            this.props.navigation.popToTop();
                        }}
                        underlayColor='#fff'>
                        <Text style={[styles.textGeneral, styles.textWhite]}>Log Out</Text>
                    </TouchableOpacity>

                </View>
            </DismissKeyboard>
        );
    }
}

export default withNavigation(withAuth(UserSettings));
