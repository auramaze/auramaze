import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import edit from "../assets/icons/edit-regular.png"
import headphone_gif from "../assets/icons/headphones-alt-solid.gif";
import AutoHeightImage from "react-native-auto-height-image";

class TitleBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const styles = StyleSheet.create({
            headerText: {
                fontSize: 20,
                width: 300,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
            },
            bottomLine: {
                borderBottomColor: '#666666',
                borderBottomWidth: 1,
                padding: 5,
                marginTop: 10,
                flexDirection: 'row',
            },
            editStyle: {
                tintColor: '#666666'
            }
        });

        return (
            <View style={styles.bottomLine}>
                <Text style={styles.headerText}>
                    {this.props.titleText}
                </Text>
                <AutoHeightImage width={25} source={edit} style={styles.editStyle}/>
            </View>
        );
    }
}

export default TitleBar;
