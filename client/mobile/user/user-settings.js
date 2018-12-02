import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    Text, TouchableOpacity, AsyncStorage
} from 'react-native';
import {withNavigation} from "react-navigation";

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

class UserSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {pageIsSign: true, id: ''};
    }

    componentDidMount() {
        AsyncStorage.getItem('id', null).then((value) => {
            this.setState({id: value});
        });
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
        });

        return (
            <DismissKeyboard>
                <View style={styles.mainStruct}>

                    <TouchableOpacity
                        style={[styles.buttonGeneral, styles.buttonEdit]}
                        underlayColor='#fff'>
                        <Text style={[styles.textGeneral, styles.textWhite]}>Edit Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonGeneral, styles.buttonEdit]}
                        underlayColor='#fff'>
                        <Text style={[styles.textGeneral, styles.textWhite]}>Change Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonGeneral, styles.buttonLogOut]}
                        onPress={this.props.navigation.getParam('logOut', null)}
                        underlayColor='#fff'>
                        <Text style={[styles.textGeneral, styles.textWhite]}>Log Out</Text>
                    </TouchableOpacity>

                </View>
            </DismissKeyboard>
        );
    }
}

export default withNavigation(UserSettings);
