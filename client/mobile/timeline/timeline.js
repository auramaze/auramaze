import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import { SearchBar } from 'react-native-elements'

class TimeLine extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let fontLoadStatus = this.props.screenProps.fontLoaded;

        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1, flexDirection: 'column',
            },
            mainContext: {
                margin: 20,
                flex: 1, flexDirection: 'column',
            },
            headerText: {
                fontSize: 20,
                color: '#666666',
                fontFamily: fontLoadStatus ? ('century-gothic-regular') : 'Cochin',
            },
            bottomLine: {
                borderBottomColor: '#666666',
                borderBottomWidth: 1,
                padding: 5,
            },
        });



        return (
            <SearchBar
                // onChangeText={someMethod}
                // onClear={someMethod}
                placeholder='Type Here...' />
        );
    }
}


export default TimeLine;
