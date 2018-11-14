import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import noImage from '../assets/icons/no-image-artizen.png';
import artist from '../assets/icons/artizen-type/artist.png'
import critic from '../assets/icons/artizen-type/critic.png'
import exhibition from '../assets/icons/artizen-type/exhibition.png'
import genre from '../assets/icons/artizen-type/genre.png'
import museum from '../assets/icons/artizen-type/museum.png'
import style from '../assets/icons/artizen-type/style.png'

class ArtizenInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const styles = StyleSheet.create({
            viewStyle: {
                flex: 1, flexDirection: 'column',
                alignItems: 'center'
            },
            badgeHolderStyle: {
                flex: 1, flexDirection: 'row',
            },
            textStyle: {
                fontSize: 30,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                marginTop: 15,
                textAlign: 'center'
            },
            badgeStyle: {
                width: 30,
                height: 30,
                marginTop: 15,
            }
        });

        return (
            <View style={styles.viewStyle}>
                <AutoHeightImage width={Dimensions.get('window').width * 2 / 5}
                                 style={{borderRadius: Dimensions.get('window').width * 14 / 750}}
                                 source={this.props.url ? {uri: this.props.url} : noImage}/>
                <Text style={styles.textStyle}>
                    {this.props.title}
                </Text>
                <View style={styles.badgeHolderStyle}>
                    {this.props.isArtist ? <Image source={artist} style={styles.badgeStyle}/> : <View/>}
                    {this.props.isMuseum ? <Image source={museum} style={styles.badgeStyle}/> : <View/>}
                    {this.props.isGenre ? <Image source={genre} style={styles.badgeStyle}/> : <View/>}
                    {this.props.isStyle ? <Image source={style} style={styles.badgeStyle}/> : <View/>}
                    {this.props.isCritic ? <Image source={critic} style={styles.badgeStyle}/> : <View/>}
                    {this.props.isExhibition ? <Image source={exhibition} style={styles.badgeStyle}/> : <View/>}
                </View>
            </View>
        )
    }

}

export default ArtizenInfo;
