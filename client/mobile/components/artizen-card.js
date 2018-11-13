import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions} from 'react-native';
import noImage from '../assets/icons/no-image-artizen.png';

class ArtizenCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const styles = StyleSheet.create({
            cardStyle: {
                flexDirection: 'row',
                height: 65,
                width: Dimensions.get('window').width * 5 / 6,
                padding: 5,
                paddingHorizontal: 15,
                alignItems: 'center',
                backgroundColor: '#ffffff',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                marginTop: this.props.topMargin, marginHorizontal: 15
            },
            imageStyle: {
                width: 50,
                height: 50,
                borderRadius: 25,
                borderColor: '#666666', borderWidth: 1,
            },
            avatarHolder: {
                height: 50, width: 50,
                alignItems: 'center',
            },
            headerText: {
                fontSize: 20, width: Dimensions.get('window').width * 225 / 375,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                marginHorizontal: 15
            },
        });


        return (
            <View style={styles.cardStyle}>
                <View style={styles.avatarHolder}>
                    <Image
                        source={this.props.source? {uri: this.props.source} : noImage}
                        style={styles.imageStyle}/>
                </View>
                <Text numberOfLines={1} style={styles.headerText}>{this.props.name}</Text>
            </View>
        )
    }

}

export default ArtizenCard;
