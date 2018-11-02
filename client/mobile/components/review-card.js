import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions} from 'react-native';
import ReviewFooter from "./review-footer";

class ReviewCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
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
                width: 50,
                height: 50,
                borderRadius: 25,
                borderColor: '#666666', borderWidth: 1,
            },
            avatarHolder: {
                height: 50, width: 50,
                alignItems: 'center',
            },
            header: {
                flexDirection: 'row',
                height: 65,
                borderBottomColor: '#666666',
                borderBottomWidth: 1,
                padding: 5,
                alignItems: 'center',
            },
            headerText: {
                fontSize: 20,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                marginHorizontal: 15
            },
            bodyText: {
                fontSize: 18,
                lineHeight: 28,
                paddingHorizontal: 10,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('segoeui') : 'Cochin',
            },
        });


        return (
            <View style={styles.cardStyle}>
                <View style={styles.header}>
                    <View style={styles.avatarHolder}>
                        <Image
                            source={{uri: 'https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/auramaze-logo-square.png'}}
                            style={styles.imageStyle}/>
                    </View>
                    <Text style={styles.headerText}>
                        AuraMaze
                    </Text>
                </View>
                <Text
                    style={styles.bodyText}>{`\n\tThe Starry Night is an oil on canvas by the Dutch post-impressionist painter Vincent van Gogh.\n\tPainted in June 1889, it depicts the view from the east-facing window of his asylum room at Saint-Rémy-de-Provence, just before sunrise, with the addition of an idealized village. It has been in the permanent collection of the Museum of Modern Art in New York City since 1941, acquired through the Lillie P. Bliss Bequest. Regarded as among Van Gogh's finest works, The Starry Night is one of the most  recognized  paintings in the history of Western culture.\n`}</Text>
                <ReviewFooter/>
            </View>
        )
    }

}

export default ReviewCard;
