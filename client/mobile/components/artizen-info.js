import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import noImage from '../icons/no-image-artizen.png';
import artist from '../icons/artizen-type/artist.png'
import critic from '../icons/artizen-type/critic.png'
import exhibition from '../icons/artizen-type/exhibition.png'
import genre from '../icons/artizen-type/genre.png'
import museum from '../icons/artizen-type/museum.png'
import style from '../icons/artizen-type/style.png'

class ArtizenInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const styles = StyleSheet.create({
            viewStyle: {
                flex: 1, flexDirection: 'column',
                alignItems: 'center',
            },
            badgeHolderStyle: {
                flex: 1, flexDirection: 'row',
            },
            textStyle: {
                fontSize: 30,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                marginTop: 15,
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
                    {this.props.isArtist ? <Image source={artist} style={styles.badgeStyle}/> : ""}
                    {this.props.isMuseum ? <Image source={museum} style={styles.badgeStyle}/> : ""}
                    {this.props.isGenre ? <Image source={genre} style={styles.badgeStyle}/> : ""}
                    {this.props.isStyle ? <Image source={style} style={styles.badgeStyle}/> : ""}
                    {this.props.isCritic ? <Image source={critic} style={styles.badgeStyle}/> : ""}
                    {this.props.isExhibition ? <Image source={exhibition} style={styles.badgeStyle}/> : ""}
                </View>
            </View>
        )
    }

}

export default ArtizenInfo;
