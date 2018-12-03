import React from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import thumbs_down from '../assets/icons/thumbs-down.png';
import thumbs_up from '../assets/icons/thumbs-up.png';
import config from "../config.json";
import {withAuth} from "../App";

class ReviewFooter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {up: props.up, down: props.down, status: props.status};
        this.handleVote = this.handleVote.bind(this);
    }

    async handleVote(type) {
        if (type === 'up' && this.state.status === 1) return;
        if (type === 'down' && this.state.status === -1) return;

        try {
            const {token} = this.props.auth;
            const authId = this.props.auth.id;

            const {itemType, itemId, textType, textId} = this.props;
            if (!authId) {
                alert('Please log in to use this function!')
            } else {
                fetch(`${config.API_ENDPOINT}/${itemType}/${itemId}/${textType}/${textId}/vote`, {
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
                        throw new Error('Vote fail.');
                    }
                }).then((responseJson) => {
                    let newUp = this.state.up;
                    let newDown = this.state.down;
                    if (type === 'up') {
                        if (this.state.status !== 1) newUp++;
                        if (this.state.status === -1) newDown--;
                    } else {
                        if (this.state.status !== -1) newDown++;
                        if (this.state.status === 1) newUp--;
                    }
                    this.setState({
                        status: type === 'up' ? 1 : -1,
                        up: newUp,
                        down: newDown
                    });
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
                flex: 1, flexDirection: 'row',
                height: 40,
                alignItems: 'center',
                justifyContent: 'flex-end',
                borderTopColor: '#666666',
                borderTopWidth: 1,
            },
            textStyle: {
                fontSize: 20,
                color: '#666666',
                marginRight: 20,
            },
            imageStyle: {
                width: 20, height: 20, margin: 10,
            },
            isClicked: {tintColor: 'black'},
            notClicked: {tintColor: '#cdcdcd'},
        });

        return (
            <View style={styles.viewStyle}>
                <TouchableOpacity onPress={() => {
                    this.handleVote('up').done()
                }}>
                    <Image source={thumbs_up} style={[styles.imageStyle,
                        this.state.status === 1 ?
                            styles.isClicked : styles.notClicked]}/>
                </TouchableOpacity>
                <Text style={styles.textStyle}>{this.state.up}</Text>
                <TouchableOpacity onPress={() => {
                    this.handleVote('down').done()
                }}>
                    <Image source={thumbs_down} style={[styles.imageStyle,
                        this.state.status === -1 ?
                            styles.isClicked : styles.notClicked]}/>
                </TouchableOpacity>
                <Text style={styles.textStyle}>{this.state.down}</Text>
            </View>
        )
    }

}

export default withAuth(ReviewFooter);
