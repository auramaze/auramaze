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

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

class UserIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {pageIsSign: true};
    }

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
                // borderWidth: 1,
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
            textGenreal: {
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

        let _checkStatus = () => {
            AsyncStorage.getAllKeys((err, keys) => {
                AsyncStorage.multiGet(keys, (err, stores) => {
                    stores.map((result, i, store) => {
                        let key = store[i][0];
                        let value = store[i][1];
                        alert(key + " " + value);
                    });
                });
            });
        };

        return (
            <DismissKeyboard>
                <View style={styles.mainStruct}>

                    <TouchableOpacity
                        onPress={_checkStatus}>
                        <AutoHeightImage width={Dimensions.get('window').width * 2 / 7}
                                         source={logoIcon}
                                         style={{marginTop: 80, marginBottom: 30}}/>
                    </TouchableOpacity>

                    <Text style={styles.signupText}>
                        Success!
                    </Text>

                    <TouchableOpacity
                        style={[styles.buttonGeneral, styles.buttonAuramaze]}
                        onPress={logOut}
                        underlayColor='#fff'>
                        <Text style={[styles.textGenreal, styles.textWhite]}>Log Out</Text>
                    </TouchableOpacity>

                </View>
            </DismissKeyboard>
        );
    }
}

export default UserIndex;
