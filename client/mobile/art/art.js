import React from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import TopBar from "../components/top-bar";
import BottomNav from "../components/bottom-nav";

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
                margin: 20,
                flex: 1, flexDirection: 'column',
                backgroundColor: '#c4def3',
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
                <ScrollView>
                    <TopBar />
                    <View style={styles.mainContext}>
                        <View style={styles.bottomLine}>
                            <Text style={styles.headerText}>
                                Introduction
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                <BottomNav/>
            </View>
        );
    }
}




export default Art;
