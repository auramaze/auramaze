import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const Art = () => {

    const {bottomLine, headerText, mainContext} = styles;
    return (
        <View>
            <View style={mainContext}>
                <View style={bottomLine}>
                    this.state.fontLoaded ? (
                    <Text style={headerText}>
                        Introduction
                    </Text>
                    ) : null
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // viewStyle: {
    //     flex: 1, flexDirection: 'row',
    //     position: 'absolute', left: 0, right: 0, bottom: 0,
    //     height: 60,
    //     backgroundColor: '#ffffff',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //     shadowColor: '#000',
    //     shadowOffset: {width: 0, height: -2},
    //     shadowOpacity: 0.2
    // },
    mainContext: {
        margin: 20
    },
    headerText: {
        fontSize: 20,
        color: '#666666',
        fontFamily: 'century-gothic-regular',
    },
    bottomLine: {
        borderBottomColor: '#666666',
        borderBottomWidth: 1,
        padding: 5,
    }
});


export default Art;
