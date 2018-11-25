import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions, TouchableOpacity, AsyncStorage} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import noImage from '../assets/icons/no-image-artizen.png';
import artist from '../assets/icons/artizen-type/artist.png';
import critic from '../assets/icons/artizen-type/critic.png';
import exhibition from '../assets/icons/artizen-type/exhibition.png';
import genre from '../assets/icons/artizen-type/genre.png';
import museum from '../assets/icons/artizen-type/museum.png';
import style from '../assets/icons/artizen-type/style.png';

class ArtizenInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isFollowing: this.props.isFollowing};
        this._handleFollow = this._handleFollow.bind(this);
    }

    async _handleFollow(type) {
        try {
            const token = await AsyncStorage.getItem('token');
            const {id} = this.props;
            if (token === 'undefined') {
                alert('Please log in to use this function!')
            } else {
                fetch(`https://apidev.auramaze.org/v1/artizen/${id}/follow`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({type})
                }).then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Follow fail.');
                    }
                }).then((responseJson) => {
                    this.setState(previousState => (
                        {isFollowing: !previousState.isFollowing}
                    ));
                }).catch(function (error) {
                    alert('There has been a problem with your fetch operation: ' + error.message);
                });
            }
        } catch (error) {
            alert(error);
        }
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
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                textAlign: 'center'
            },
            badgeStyle: {
                width: 30,
                height: 30,
                marginTop: 15,
            },
            followButton: {
                marginTop: 20,
                borderWidth: 2,
                borderColor: '#666666',
                borderRadius: 20,
            },
            textTitleStyle: {
                fontSize: 30, marginTop: 15
            },
            textFollowStyle: {
                fontSize: 20, marginVertical: 3, marginHorizontal: 17,
            }
        });

        return (
            <View style={styles.viewStyle}>
                <AutoHeightImage width={Dimensions.get('window').width * 2 / 5}
                                 style={{borderRadius: Dimensions.get('window').width * 14 / 750}}
                                 source={this.props.url ? {uri: this.props.url} : noImage}/>
                <Text style={[styles.textStyle, styles.textTitleStyle]}>
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

                <TouchableOpacity
                    onPress={() => {
                        this._handleFollow(!this.state.isFollowing).done()
                    }}>
                    {parseInt(this.props.myId) !== this.props.id ?
                        <View style={styles.followButton}>
                            <Text style={[styles.textStyle, styles.textFollowStyle]}>
                                {this.state.isFollowing ? "Following" : "Follow"}
                            </Text>
                        </View> : null}
                </TouchableOpacity>

            </View>
        )
    }
}

export default ArtizenInfo;
