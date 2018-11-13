import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import compass from '../assets/icons/compass.png';
import journal from '../assets/icons/journal.png';
import camera from '../assets/icons/camera.png';
import recommendation from '../assets/icons/recommand.png';
import lines from '../assets/icons/lines.png';

class BottomNav extends React.Component {

    render() {
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


        return (
            <View style={styles.viewStyle}>
                <Image source={compass} style={styles.imageStyle}/>
                <Image source={journal} style={styles.imageStyle}/>
                <View style={styles.cameraHolder}>
                    <Image source={camera} style={styles.cameraStyle}/>
                </View>
                <Image source={recommendation} style={styles.imageStyle}/>
                <Image source={lines} style={styles.imageStyle}/>
            </View>
        )
    }

}

export default BottomNav;
