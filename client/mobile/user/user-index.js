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
import config from "../config";

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

class UserIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {pageIsSign: true, id: this.props.id, token: this.props.token, avatar: null};
    }

    componentDidMount() {
        fetch(`${config.API_ENDPOINT}/artizen/${this.state.id}`, {
            method: 'GET',
            headers: this.state.token && this.state.token !== 'undefined' && this.state.token !== 'null' ? {
                'Authorization': `Bearer ${this.state.token}`
            } : null
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Get user info fail.');
            }
        }).then((responseJson) => {
                this.setState({avatar: responseJson.avatar});
            }
        ).catch(function (error) {
            alert('There has been a problem with your fetch operation: ' + error.message);
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
            textGeneral: {
                textAlign: 'center',
                paddingHorizontal: 10,
                fontSize: 15
            },
            textWhite: {color: 'white'},
        });

        let logOut = async () => {
            try {
                await AsyncStorage.setItem('isAuthorized', 'false')
                    .then(this.props.screenProps.toLogOut);
            } catch (error) {
                alert(error)
            }
        };

        return (
            <DismissKeyboard>
                <View style={styles.mainStruct}>

                    <AutoHeightImage width={Dimensions.get('window').width * 2 / 7}
                                     source={this.state.avatar ? {uri: this.state.avatar} : logoIcon}
                                     style={{
                                         marginTop: Dimensions.get('window').width * 80 / 375,
                                         marginBottom: 30
                                     }}/>

                    <TouchableOpacity
                        style={[styles.buttonGeneral, styles.buttonAuramaze]}
                        onPress={() => this.props.navigation.navigate('UserSettings', {
                            logOut: logOut
                        })}>
                        underlayColor='#fff'>
                        <Text style={[styles.textGeneral, styles.textWhite]}>User Settings</Text>
                    </TouchableOpacity>

                </View>
            </DismissKeyboard>
        );
    }
}

export default UserIndex;
