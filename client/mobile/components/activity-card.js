import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions, TouchableOpacity} from 'react-native';
import ReviewFooter from "./review-footer";
import headphone from "../assets/icons/headphones-alt-solid.png"
import headphone_gif from "../assets/icons/headphones-alt-solid.gif"
import AutoHeightImage from 'react-native-auto-height-image';
import noImage from "../assets/icons/no-image-artizen.png";

class ActivityCard extends React.Component {

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
                marginHorizontal: -10,
                marginVertical: 10
            },
            avatarStyle: {
                width: 50, height: 50,
                borderRadius: 25,
                borderColor: '#666666', borderWidth: 1,
            },
            artizenViewStyle: {
                flex: 1, flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#fafafa',
                marginHorizontal: -10,
                marginVertical: 10,
                paddingTop: 10,
                paddingBottom: 10
            },
            artizenAvatarStyle: {
                width: 50, height: 50,
                borderRadius: 25,
                borderColor: '#666666', borderWidth: 1,
            },
            artizenNameStyle: {
                fontSize: 25,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                marginTop: 15,
                textAlign: 'center'
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
                padding: 5,
                alignItems: 'center',
            },
            headerText: {
                fontSize: 20, width: this.props.isIntro ? 195 : 225,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                marginHorizontal: 15
            },
            bodyText: {
                fontSize: 18,
                lineHeight: 28,
                paddingHorizontal: 10,
                paddingBottom: 10,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('segoeui') : 'Cochin',
            },
        });


        return (
            <View style={styles.cardStyle}>
                <View style={styles.header}>
                    <View style={styles.avatarHolder}>
                        <Image
                            source={this.props.source ? {uri: this.props.source} : noImage}
                            style={styles.avatarStyle}/>
                    </View>
                    <Text style={styles.headerText} numberOfLines={1}>{this.props.name}</Text>
                    {this.props.isIntro ? <TouchableOpacity onPress={() => {
                        Expo.Speech.isSpeakingAsync().then((result) => {
                            if (result) {
                                Expo.Speech.stop();
                            } else {
                                Expo.Speech.speak(this.props.text);
                            }
                        });
                    }}>
                        {this.state.isSpeaking && this.props.isIntro ?
                            <AutoHeightImage width={30} source={headphone_gif} style={styles.headphoneStyleGif}/> :
                            <AutoHeightImage width={30} source={headphone} style={styles.headphoneStyle}/>}
                    </TouchableOpacity> : null}

                </View>
                {this.props.artSource ?
                    <AutoHeightImage style={styles.imageStyle} width={Dimensions.get('window').width}
                                     source={{uri: this.props.artSource}}/> :
                    <View style={styles.artizenViewStyle}>
                        <AutoHeightImage width={Dimensions.get('window').width * 2 / 5}
                                         style={{borderRadius: Dimensions.get('window').width * 14 / 750}}
                                         source={this.props.artizenSource ? {uri: this.props.artizenSource} : noImage}/>
                        <Text style={styles.artizenNameStyle}>
                            {this.props.artizenName}
                        </Text>
                    </View>}
                <Text style={styles.bodyText}>{this.props.text}</Text>
                <ReviewFooter up={this.props.up} down={this.props.down} status={this.props.status}
                              itemType={this.props.itemType} itemId={this.props.itemId}
                              textType={this.props.textType} textId={this.props.textId}/>
            </View>
        )
    }

}

export default ActivityCard;
