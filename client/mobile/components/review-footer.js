import React from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity, AsyncStorage} from 'react-native';
import thumbs_down from '../assets/icons/thumbs-down.png';
import thumbs_up from '../assets/icons/thumbs-up.png';

class ReviewFooter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {up: props.up, down: props.down, status: props.status};
        this.handleVote = this.handleVote.bind(this);
    }

    async handleVote(type) {
        try {
            const token = await AsyncStorage.getItem('token');
            const {itemType, itemId, textType, textId} = this.props;
            if (token === null) {
                alert('Please log in to use this function!')
            } else {
                fetch(`https://apidev.auramaze.org/v1/${itemType}/${itemId}/${textType}/${textId}/vote`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    },
                    body: {type}
                }).then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Vote fail.');
                    }
                }).then((responseJson) => {

                }).catch(function (error) {
                    this.setState(previousState => ({auramazeProcessing: false}));
                    alert('There has been a problem with your fetch operation: ' + error.message);
                });
            }
        } catch (error) {
            alert(error);
        }
    }

    render() {
        const styles = StyleSheet.create({
            viewStyle: {
                flex: 1, flexDirection: 'row',
                height: 40,
                alignItems: 'center',
                justifyContent: 'flex-end',
                borderTopColor: '#666666',
                borderTopWidth: 1,
            },
            textStyle: {
                fontSize: 20,
                color: '#666666',
                marginRight: 20,
            },
            imageStyle: {
                width: 20, height: 20, margin: 10,
                tintColor: '#cdcdcd'
            }
        });

        return (
            <View style={styles.viewStyle}>
                <TouchableOpacity onPress={() => {
                    alert("itemId: " + this.props.itemId +
                        "\nitemType: " + this.props.itemType +
                        "\ntextId: " + this.props.textId +
                        "\ntextType: " + this.props.textType +
                        "\nstate: " + this.props.state)
                }}>
                    <Image source={thumbs_up} style={styles.imageStyle}/>
                </TouchableOpacity>
                <Text style={styles.textStyle}>{this.props.up}</Text>
                <Image source={thumbs_down} style={styles.imageStyle}/>
                <Text style={styles.textStyle}>{this.props.down}</Text>
            </View>
        )
    }

}

export default ReviewFooter;
