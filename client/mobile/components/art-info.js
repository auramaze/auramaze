import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions} from 'react-native';

class ArtInfo extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {

        const styles = StyleSheet.create({
            viewStyle: {
                flex: 1, flexDirection: 'column',
                alignItems: 'center',
            },
            textStyle: {
                fontSize: 30,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',

            },
            imageStyle: {
                width: Dimensions.get('window').width,
                height: 300,
            }
        });

        return (
            <View style={styles.viewStyle}>
                <Image resizeMode="contain" style={styles.imageStyle}
                       source={{uri: 'https://s3.us-east-2.amazonaws.com/auramaze-test/images/jacques-louis-david/1787/197945.jpg'}}/>
                <Text style={styles.textStyle}>
                    The Starry Night
                </Text>
            </View>
        )
    }

}

export default ArtInfo;
