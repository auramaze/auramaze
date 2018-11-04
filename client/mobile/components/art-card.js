import React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";

class ArtCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const styles = StyleSheet.create({
            cardStyle: {
                flexDirection: 'column',
                width: Dimensions.get('window').width * 5 / 6,
                backgroundColor: '#ffffff',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                marginHorizontal: 15, marginVertical: 20,
            },
            generalText: {
                color: '#666666', marginHorizontal: 15,
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
            },
            headerText: {
                fontSize: 20, marginTop: 10
            },
            infoText: {
                fontSize: 15, marginBottom: 10
            },
        });


        return (
            <View style={styles.cardStyle}>
                <AutoHeightImage width={Dimensions.get('window').width * 5 / 6}
                                 source={{uri: this.props.source}}/>
                <Text style={[styles.generalText, styles.headerText]}>{this.props.artName}</Text>
                <Text style={[styles.generalText, styles.infoText]}>
                    {this.props.artistName}, {this.props.compYear}
                </Text>
            </View>
        )
    }

}

export default ArtCard;
