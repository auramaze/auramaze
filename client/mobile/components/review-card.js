import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import getRNDraftJSBlocks from 'react-native-draftjs-render';
import ReviewFooter from "./review-footer";
import headphone from "../assets/icons/headphones-alt-solid.png"
import headphone_gif from "../assets/icons/headphones-alt-solid.gif"
import AutoHeightImage from 'react-native-auto-height-image';
import noImage from "../assets/icons/no-image-artizen.png";

class ReviewCard extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {isSpeaking: false};

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
                width: 50, height: 50,
                borderRadius: 25,
                borderColor: '#666666', borderWidth: 1,
            },
            headphoneStyle: {
                tintColor: '#666666'
            },
            headphoneStyleGif: {
                tintColor: 'tomato'
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
                fontSize: 20, width: this.props.isIntro ? 195 : 225,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                marginHorizontal: 15
            },
            bodyView: {
                paddingHorizontal: 10,
                paddingVertical: 10
            },
            bodyText: {
                fontSize: 18,
                lineHeight: 28,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('segoeui') : 'Cochin'
            }
        });


        return (
            <View style={styles.cardStyle}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.push('Artizen', {
                            artizenId: this.props.authorId
                        })}>
                        <View style={styles.avatarHolder}>
                            <Image
                                source={this.props.source ? {uri: this.props.source} : noImage}
                                style={styles.imageStyle}/>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.headerText} numberOfLines={1}>{this.props.name}</Text>
                    {this.props.isIntro && this.props.content ?
                        <TouchableOpacity onPress={() => {
                            Expo.Speech.isSpeakingAsync().then((result) => {
                                this.setState(previousState => ({isSpeaking: !previousState.isSpeaking}));
                                if (result) {
                                    Expo.Speech.stop();
                                } else {
                                    Expo.Speech.speak(this.props.content.blocks.map(block => block.text).join('\n'));
                                }
                            });
                        }}>
                            {this.state.isSpeaking && this.props.isIntro ?
                                <AutoHeightImage width={30} source={headphone_gif} style={styles.headphoneStyleGif}/> :
                                <AutoHeightImage width={30} source={headphone} style={styles.headphoneStyle}/>}
                        </TouchableOpacity> : null}

                </View>
                <View style={styles.bodyView}>
                    {this.props.content &&
                    getRNDraftJSBlocks({
                        contentState: this.props.content
                    })}
                </View>
                <ReviewFooter up={this.props.up} down={this.props.down} status={this.props.status}
                              itemType={this.props.itemType} itemId={this.props.itemId}
                              textType={this.props.textType} textId={this.props.textId}/>
            </View>
        )
    }

}

export default withNavigation(ReviewCard);
