import React from 'react';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import TopBar from "../components/top-bar";
import BottomNav from "../components/bottom-nav";
import ReviewCard from "../components/review-card";

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
                        <ReviewCard fontLoaded={this.props.fontLoaded}/>
                        <ReviewCard fontLoaded={this.props.fontLoaded}/>
                        <ReviewCard fontLoaded={this.props.fontLoaded}/>
                    </View>
                </ScrollView>
                <BottomNav/>
            </View>
        );
    }
}




export default Art;
