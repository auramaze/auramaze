import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import compass from './icons/compass.png';
import journal from './icons/journal.png';
import camera from './icons/camera.png';
import recommendation from './icons/recommand.png';
import lines from './icons/lines.png';

const BottomNav = () => {
    const {cameraStyle, viewStyle, imageStyle, cameraHolder} = styles;
    return (
        <View style={viewStyle}>
            <Image source={compass} style={imageStyle} />
            <Image source={journal} style={imageStyle} />
            <View style={cameraHolder}>
                <Image source={camera} style={cameraStyle} />
            </View>
            <Image source={recommendation} style={imageStyle} />
            <Image source={lines} style={imageStyle} />
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
        justifyContent: 'space-between',
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
        margin: 15,
        tintColor: '#666666'
    },
    cameraStyle: {
        width: 30,
        height: 30,
        tintColor: '#fff',
    },
    cameraHolder: {
        flex: 1, flexDirection: 'row',
        width: 70,
        height: 40,
        backgroundColor: '#909090',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    }
});


export default BottomNav;
