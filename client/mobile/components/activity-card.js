import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import getRNDraftJSBlocks from 'react-native-draftjs-render';
import ReviewFooter from "./review-footer";
import AutoHeightImage from 'react-native-auto-height-image';
import noImage from "../assets/icons/no-image-artizen.png";
import Moment from 'react-moment';

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
                marginTop: 10,
                marginBottom: 30,
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
                fontSize: 21,
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
                fontSize: 20,
                width: 150,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                marginHorizontal: 15
            },
            timeText: {
                fontSize: 20,
                color: '#aeaeae',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin'
            },
            bodyView: {
                paddingHorizontal: 10,
                paddingBottom: 10
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
                                style={styles.avatarStyle}/>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.headerText} numberOfLines={1}>{this.props.name}</Text>
                    <Moment fromNow style={styles.timeText} element={Text}>{this.props.created}</Moment>
                </View>
                {this.props.artId ?
                    <TouchableOpacity
                        onPress={() => this.props.navigation.push('Art', {
                            artId: this.props.artId
                        })}>
                        <AutoHeightImage style={styles.imageStyle} width={Dimensions.get('window').width}
                                         source={{uri: this.props.artSource}}/>
                    </TouchableOpacity> :
                    <TouchableOpacity
                        onPress={() => this.props.navigation.push('Artizen', {
                            artizenId: this.props.artizenId
                        })}>
                        <View style={styles.artizenViewStyle}>
                            <AutoHeightImage width={Dimensions.get('window').width * 2 / 5}
                                             style={{borderRadius: Dimensions.get('window').width * 14 / 750}}
                                             source={this.props.artizenSource ? {uri: this.props.artizenSource} : noImage}/>
                            <Text style={styles.artizenNameStyle}>
                                {this.props.artizenName}
                            </Text>
                        </View>
                    </TouchableOpacity>}
                <View style={styles.bodyView}>
                    {this.props.content && getRNDraftJSBlocks({
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

export default withNavigation(ActivityCard);
