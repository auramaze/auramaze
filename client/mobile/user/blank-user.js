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

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

class BlankUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static _onPressButton() {
        alert("asd");
    };

    static createAuraMaze = async () => {
        try {
            this.setState({auramazeProcessing: true});
            await AsyncStorage.setItem('key', 'I like to save it.');
        } catch (error) {

        }
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

        let fontLoadStatus = this.props.screenProps.fontLoaded;

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
            signupText: {
                color: '#666666',
                textAlign: 'center',
                paddingHorizontal: 10,
                fontSize: 15
            }
        });

        return (
            <DismissKeyboard>
                <View style={styles.mainStruct}>

                    <AutoHeightImage width={Dimensions.get('window').width * 2 / 7}
                                     source={logoIcon}
                                     style={{marginTop: 80, marginBottom: 30}}/>


                    <Input placeholder='Name'
                           inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                           onChangeText={(username) => this.setState(previousState => ({username: username}))}
                    />
                    <Input placeholder='Email'
                           inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                           onChangeText={(email) => this.setState(previousState => ({email: email}))}
                    />
                    <Input placeholder='Password'
                           inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                           onChangeText={(password) => this.setState(previousState => ({password: password}))}
                           containerStyle={{marginBottom: 10}}
                    />

                    <TouchableOpacity
                        style={[styles.buttonGeneral, styles.buttonAuramaze]}
                        onPress={BlankUser._storeData}
                        underlayColor='#fff'>
                        <AutoHeightImage
                            width={20}
                            source={logoIcon} style={{tintColor: 'white'}}/>
                        <Text style={[styles.textGenreal, styles.textAuramaze]}>Create AuraMaze account</Text>
                    </TouchableOpacity>

                    <Hr color='#666666' width={1} style={{paddingHorizontal: 20}}>
                        <Text style={styles.textWithDivider}>OR</Text>
                    </Hr>

                    <TouchableOpacity
                        style={[styles.buttonGeneral, styles.buttonGoogle]}
                        onPress={BlankUser._retrieveData}
                        underlayColor='#fff'>
                        <AutoHeightImage
                            width={20}
                            source={google}/>
                        <Text style={[styles.textGenreal, styles.textGoogle]}>Sign up with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonGeneral, styles.buttonFacebook]}
                        onPress={BlankUser._onPressButton}
                        underlayColor='#fff'>
                        <AutoHeightImage
                            width={20}
                            source={facebook}/>
                        <Text style={[styles.textGenreal, styles.textFacebook]}>Sign up with Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.signupScreenButton}
                        onPress={BlankUser._onPressButton}
                        underlayColor='#fff'>
                        <Text style={styles.signupText}>Already have an account? Log In</Text>
                    </TouchableOpacity>

                </View>
            </DismissKeyboard>
        );
    }
}


export default BlankUser;
