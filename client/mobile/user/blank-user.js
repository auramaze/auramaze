import React from 'react';
import {StyleSheet, View, Dimensions, Button, Text, TouchableOpacity} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";
import noImage from "../icons/no-image-artizen.png";

class BlankUser extends React.Component {

    constructor(props) {
        super(props);
    }

    _onPressButton() {
        alert("asd");
    };

    state = {};

    render() {

        let fontLoadStatus = this.props.screenProps.fontLoaded;


        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1, flexDirection: 'column',
                alignItems: 'center'
            },
            loginScreenButton:{
                width: Dimensions.get('window').width * 2 / 3,
                marginRight:40,
                marginLeft:40,
                marginTop:10,
                paddingTop:10,
                paddingBottom:10,
                borderWidth: 1,
                backgroundColor:'#666666',
                borderColor: '#666666',
                borderRadius:5
            },
            signupScreenButton:{
                width: Dimensions.get('window').width * 2 / 3,
                marginRight:40,
                marginLeft:40,
                paddingTop:10,
                paddingBottom:10,
                backgroundColor:'white',
                // borderWidth: 1,
                borderColor: '#666666',
                borderRadius:5
            },
            loginText:{
                fontWeight: 'bold',
                color:'#fff',
                textAlign:'center',
                paddingHorizontal : 10,
                fontSize: 15
            },
            signupText:{
                fontWeight: 'bold',
                color:'#666666',
                textAlign:'center',
                paddingHorizontal : 10,
                fontSize: 15
            }
        });

        return (
            <View style={styles.mainStruct}>
                <View style={{height: 120}}/>
                <AutoHeightImage width={Dimensions.get('window').width * 2 / 5}
                                 style={{borderRadius: Dimensions.get('window').width * 14 / 750}}
                                 source={noImage}/>
                <View style={{height: 80}}/>
                <TouchableOpacity
                    style={styles.loginScreenButton}
                    onPress={this._onPressButton}
                    underlayColor='#fff'>
                    <Text style={styles.loginText}>Sign Up</Text>
                </TouchableOpacity>
                <View style={{height: 10}}/>
                <TouchableOpacity
                    style={styles.signupScreenButton}
                    onPress={this._onPressButton}
                    underlayColor='#fff'>
                    <Text style={styles.signupText}>Log In</Text>
                </TouchableOpacity>

            </View>
        );
    }
}


export default BlankUser;
