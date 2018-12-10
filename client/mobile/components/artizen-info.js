import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions, TouchableOpacity} from 'react-native';
import {Image as CachedImage, CacheManager} from "react-native-expo-image-cache";
import artist from '../assets/icons/artizen-type/artist.png';
import critic from '../assets/icons/artizen-type/critic.png';
import exhibition from '../assets/icons/artizen-type/exhibition.png';
import genre from '../assets/icons/artizen-type/genre.png';
import museum from '../assets/icons/artizen-type/museum.png';
import style from '../assets/icons/artizen-type/style.png';
import config from "../config.json";
import {withAuth} from "../App";
import {checkResponseStatus, noImage} from "../utils";

class ArtizenInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isFollowing: this.props.isFollowing, path: null};
        this._handleFollow = this._handleFollow.bind(this);
    }

    async componentDidMount() {
        const path = await CacheManager.get(this.props.url).getPath();
        this.setState({path});
    }

    async _handleFollow(type) {
        try {
            const {token} = this.props.auth;
            const authId = this.props.auth.id;

            const {id} = this.props;
            if (!authId) {
                alert('Please log in to use this function!')
            } else {
                const response = await fetch(`${config.API_ENDPOINT}/artizen/${id}/follow`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({type})
                });
                if (!await checkResponseStatus(response, this.props.auth.removeAuth)) {
                    return;
                }
                const responseJson = await response.json();
                this.setState(previousState => (
                    {isFollowing: !previousState.isFollowing}
                ));
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
                fontSize: 20, marginVertical: 5, marginHorizontal: 17,
            }
        });

        return (
            <View style={styles.viewStyle}>
                <CachedImage style={{
                    height: Dimensions.get('window').width * 2 / 5,
                    width: Dimensions.get('window').width * 2 / 5,
                    borderRadius: Dimensions.get('window').width * 14 / 750
                }} uri={this.state.path || noImage}/>
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

export default withAuth(ArtizenInfo);
