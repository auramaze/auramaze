import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import edit from "../assets/icons/edit-regular.png";
import cross from "../assets/icons/times-solid.png";
import AutoHeightImage from "react-native-auto-height-image";
import {Input} from "react-native-elements";
import {checkResponseStatus, convertTextToDraftjsContent} from "../utils";
import config from "../config.json";
import {withAuth} from "../App";

class TitleBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isEditing: false, review: ""};
        this._handleTouchEdit = this._handleTouchEdit.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    async _handleTouchEdit() {
        if (!this.props.auth.id) {
            alert('Please log in to use this function!')
        } else {
            this.setState(previousState => (
                {isEditing: !previousState.isEditing}
            ));
        }
    }

    async _handleSubmit() {
        try {
            const {id, token} = this.props.auth;
            const {itemType, itemId, textType} = this.props;
            if (!id) {
                alert('Please log in to use this function!')
            } else {
                const response = await fetch(`${config.API_ENDPOINT}/${itemType}/${itemId}/${textType}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({content: convertTextToDraftjsContent(this.state.review), rating: null})
                });
                if (!await checkResponseStatus(response, this.props.auth.removeAuth)) {
                    return;
                }
                const responseJson = await response.json();
                this.setState(previousState => (
                    {isEditing: !previousState.isEditing}
                ));
                this.props.reloadFunc();
            }
        } catch (error) {
            alert(error);
        }
    }

    render() {
        const styles = StyleSheet.create({
            mainStruct: {
                width: Dimensions.get('window').width - 15,
            },
            headerText: {
                fontSize: 20,
                width: 300,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
            },
            bottomLine: {
                borderBottomColor: '#666666',
                borderBottomWidth: 1,
                padding: 5,
                marginTop: 10,
                flexDirection: 'row',
            },
            editStyle: {
                tintColor: '#666666'
            },
            editingStyle: {
                tintColor: 'tomato'
            },
            cardStyle: {
                padding: 15,
                marginTop: 15,
                alignItems: 'center',
                backgroundColor: '#ffffff',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
            },
            submitButton: {
                marginTop: 10,
                borderWidth: 2,
                borderColor: '#666666',
                borderRadius: 20,
            },
            textStyle: {
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                textAlign: 'center',
                fontSize: 15, marginVertical: 3, marginHorizontal: 17,
            },
        });

        return (
            <View style={styles.mainStruct}>
                <View style={styles.bottomLine}>
                    <Text style={styles.headerText}>
                        {this.props.titleText}
                    </Text>
                    {this.props.couldEdit ?
                        <TouchableOpacity
                            onPress={this._handleTouchEdit}>
                            <AutoHeightImage width={25} source={this.state.isEditing ? cross : edit}
                                             style={this.state.isEditing ? styles.editingStyle : styles.editStyle}/>
                        </TouchableOpacity>
                        : null}
                </View>
                {this.state.isEditing ?
                    <View style={styles.cardStyle}>
                        <Input placeholder='Enter your review here...'
                               inputContainerStyle={{borderBottomColor: '#cdcdcd'}}
                               multiline={true}
                               autoFocus={true}
                               onChangeText={(review) => this.setState({review: review})}/>

                        <TouchableOpacity
                            onPress={this._handleSubmit}>
                            <View style={styles.submitButton}>
                                <Text style={styles.textStyle}>
                                    Submit
                                </Text>
                            </View>
                        </TouchableOpacity>


                    </View> : null}
            </View>

        );
    }
}

export default withAuth(TitleBar);
