import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import compass from './icons/compass.png';
import journal from './icons/journal.png';

const BottomNav = () => {
    const {textStyle, viewStyle, imageStyle} = styles;
    return (
        <View style={viewStyle}>
            <Image source={compass} style={imageStyle} />
            <Image source={journal} style={imageStyle} />
            <Text style={textStyle}> Hello world! </Text>
            <Text style={textStyle}> Goodbye world! </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1, flexDirection: 'row',
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: 60,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.2
    },
    textStyle: {
        fontSize: 20,
        color: '#666666',
    },
    imageStyle: {
        width: 30,
        height: 30,
        tintColor: '#666666'
    }
});


export default BottomNav;
