import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import left from '../icons/left.png';
import share from '../icons/share.png';

const TopBar = () => {
    const {viewStyle, imageStyle} = styles;
    return (
        <View style={viewStyle}>
            <Image source={left} style={imageStyle} />
            <Image source={share} style={imageStyle} />
        </View>
    );
};

const styles = StyleSheet.create({
    viewStyle: {
        flex: 1, flexDirection: 'row',
        position: 'absolute', left: 0, right: 0, top: 0,
        height: 60,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 15
    },
    imageStyle: {
        width: 30,
        height: 30,
        margin: 15,
        tintColor: '#666666'
    }
});


export default TopBar;
