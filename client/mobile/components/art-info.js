import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions, TouchableOpacity} from 'react-native';
import {Image as CachedImage, CacheManager} from "react-native-expo-image-cache";
import config from "../config";
import {withAuth} from "../App";
import {checkResponseStatus, getImageDefaultHeight, getImageDefaultUrl, getImageDefaultWidth, noImage} from "../utils";

class ArtInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isFollowing: this.props.isFollowing, path: null};
        this._handleFollow = this._handleFollow.bind(this);
    }

    async componentDidMount() {
        const path = await CacheManager.get(getImageDefaultUrl(this.props.image)).getPath();
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
                const response = await fetch(`${config.API_ENDPOINT}/art/${id}/follow`, {
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
            textStyle: {
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                textAlign: 'center'
            },
            followButton: {
                marginTop: 10,
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

        console.log(this.state.path);

        return (
            <View style={styles.viewStyle}>
                <CachedImage style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').width * getImageDefaultHeight(this.props.image) / getImageDefaultWidth(this.props.image)
                }} uri={this.state.path || noImage}/>
                <Text style={[styles.textStyle, styles.textTitleStyle]}>
                    {this.props.title}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        this._handleFollow(!this.state.isFollowing).done()
                    }}>
                    <View style={styles.followButton}>
                        <Text style={[styles.textStyle, styles.textFollowStyle]}>
                            {this.state.isFollowing ? "Following" : "Follow"}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

}

export default withAuth(ArtInfo);
