import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions} from 'react-native';

import AutoHeightImage from 'react-native-auto-height-image';
import heart from '../assets/icons/heart-regular.png';

class ArtInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const styles = StyleSheet.create({
            viewStyle: {
                flex: 1, flexDirection: 'column',
                alignItems: 'center'
            },
            textStyle: {
                fontSize: 30,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                marginTop: 15,
                textAlign: 'center'
            },
            loveStyle: {
                width: 30,
                height: 30,
                tintColor: '#ff7d7d',
                marginTop: 15,
            }
        });

        return (
            <View style={styles.viewStyle}>
                <AutoHeightImage width={Dimensions.get('window').width}
                       source={{uri: this.props.url}}/>
                <Text style={styles.textStyle}>
                    {this.props.title}
                </Text>
                <Image source={heart} style={styles.loveStyle}/>
            </View>
        )
    }

}

export default ArtInfo;
