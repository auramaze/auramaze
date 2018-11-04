import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Constants } from 'expo';

class TimeLine extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let fontLoadStatus = this.props.screenProps.fontLoaded;

        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1,
                alignItems: 'center',
                paddingTop: Constants.statusBarHeight,
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
            }
        });

        return (
            <View style={styles.mainStruct}>
                <SearchBar
                    // lightTheme
                    containerStyle={{backgroundColor: '#fff'}}
                    inputContainerStyle={{backgroundColor: '#eeeeee'}}
                    platform="ios"
                    cancelButtonTitle="Cancel"
                    placeholder='Search' />
            </View>
        );
    }
}


export default TimeLine;
