import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import TopBar from "../components/top-bar";

class Art extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1, flexDirection: 'column',
            },
            mainContext: {
                margin: 20
            },
            headerText: {
                fontSize: 20,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
            },
            bottomLine: {
                borderBottomColor: '#666666',
                borderBottomWidth: 1,
                padding: 5,
            }
        });

        return (
            <View style={styles.mainStruct}>
                <TopBar/>
                <View style={styles.mainContext}>
                    <View style={styles.bottomLine}>
                        <Text style={styles.headerText}>
                            Introduction
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}




export default Art;
