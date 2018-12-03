import React from 'react';
import {StyleSheet, View, Image, Text, Dimensions, TouchableOpacity} from 'react-native';

import AutoHeightImage from 'react-native-auto-height-image';
import config from "../config";
import {withAuth} from "../App";

class ArtInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isFollowing: this.props.isFollowing};
        this._handleFollow = this._handleFollow.bind(this);
    }

    async _handleFollow(type) {
        try {
            const {token} = this.props.auth;
            const authId = this.props.auth.id;

            const {id} = this.props;
            if (!authId) {
                alert('Please log in to use this function!')
            } else {
                fetch(`${config.API_ENDPOINT}/art/${id}/follow`, {
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

        return (
            <View style={styles.viewStyle}>
                <AutoHeightImage width={Dimensions.get('window').width}
                                 source={{uri: this.props.url}}/>
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
