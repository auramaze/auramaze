import React from 'react';
import {StyleSheet, View, Image, Text} from 'react-native';

class TextCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render () {
        const styles = StyleSheet.create({
            cardStyle: {
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                marginTop: 15,
                padding: 10,
            },
            imageStyle: {
                width: 30,
                height: 30,
                margin: 15,
                tintColor: '#666666'
            },
            header: {
                flexDirection: 'row',
                height: 50,
                borderBottomColor: '#666666',
                borderBottomWidth: 1,
                padding: 5
            },
            headerText: {
                fontSize: 20,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
            },
            bodyText: {
                fontSize: 18,
                paddingHorizontal: 10,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('segoeui') : 'Cochin',
            },
        });


        return (
            <View style={styles.cardStyle}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        AuraMaze
                    </Text>
                </View>
                <Text style={styles.bodyText}>{`
                The Starry Night is an oil on canvas by the Dutch post-impressionist painter Vincent van Gogh.
                Painted in June 1889, it depicts the view from the east-facing window of his asylum room at Saint-Rémy-de-Provence, just before sunrise, with the addition of an idealized village. It has been in the permanent collection of the Museum of Modern Art in New York City since 1941, acquired through the Lillie P. Bliss Bequest. Regarded as among Van Gogh's finest works, The Starry Night is one of the most  recognized  paintings in the history of Western culture.
                `}</Text>
            </View>
        )
    }

}

export default TextCard;
