import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions, TouchableOpacity} from 'react-native';

class MessageCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const styles = StyleSheet.create({
            cardStyle: {
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                marginTop: 15,
                padding: 10,
            },
            bodyView: {
                paddingHorizontal: 10,
                paddingVertical: 10
            },
            bodyText: {
                fontSize: 18,
                lineHeight: 28,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('segoeui') : 'Cochin'
            }
        });


        return (
            <TouchableOpacity style={styles.cardStyle} onPress={this.props.onPress}>
                <View style={styles.bodyView}>
                    <Text style={styles.bodyText}>{this.props.text}</Text>
                </View>
            </TouchableOpacity>
        )
    }

}

export default MessageCard;
