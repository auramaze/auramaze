import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

class TitleBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const styles = StyleSheet.create({
            headerText: {
                fontSize: 20,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
            },
            bottomLine: {
                borderBottomColor: '#666666',
                borderBottomWidth: 1,
                padding: 5,
                marginTop: 10,
            },
        });

        return (
            <View style={styles.bottomLine}>
                <Text style={styles.headerText}>
                    {this.props.titleText}
                </Text>
            </View>
        );
    }
}


export default TitleBar;
