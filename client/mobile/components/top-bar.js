import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import left from '../icons/left.png';
import share from '../icons/share.png';

const TopBar = () => {
    const {viewStyle, imageStyle} = styles;
    return (
        <View style={viewStyle}>
            <Image source={left} style={imageStyle}/>
            <Image source={share} style={imageStyle}/>
        </View>
    );
};

const styles = StyleSheet.create({
    viewStyle: {
        flexDirection: 'row',
        height: 50,
        // backgroundColor: '#f2a6c3',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 25, marginHorizontal: 15,
    },
    imageStyle: {
        width: 30,
        height: 30,
        margin: 10,
        tintColor: '#666666'
    }
});


export default TopBar;
