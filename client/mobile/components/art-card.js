import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";

class ArtCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const styles = StyleSheet.create({
            cardStyle: {
                flexDirection: 'column',
                width: Dimensions.get('window').width*5/6,
                backgroundColor: '#ffffff',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                marginHorizontal: 15,
            },
            avatarHolder: {
                height: 50, width: 50,
                alignItems: 'center',
            },
            headerText: {
                fontSize: 20,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                marginHorizontal: 15, marginBottom: 5, marginTop: 10
            },
            infoText: {
                fontSize: 15,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                marginHorizontal: 15, marginBottom: 10
            },
        });


        return (
            <View style={styles.cardStyle}>
                <AutoHeightImage width={Dimensions.get('window').width*5/6}
                                 source={{uri: this.props.source}}/>
                <Text style={styles.headerText}>{this.props.artName}</Text>
                <Text style={styles.infoText}>{this.props.artistName}, {this.props.compYear}</Text>
            </View>
        )
    }

}

export default ArtCard;
