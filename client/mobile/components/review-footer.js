import React from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity, AsyncStorage} from 'react-native';
import {VoteContext} from '../App';
import thumbs_down from '../assets/icons/thumbs-down.png';
import thumbs_up from '../assets/icons/thumbs-up.png';

class ReviewFooter extends React.Component {

    constructor(props) {
        super(props);
        this.handleVote = this.handleVote.bind(this);
    }

    async handleVote(type, vote, updateVote) {
        const {itemType, itemId, textType, textId} = this.props;
        const token = await AsyncStorage.getItem('token');
        const status = vote[textId] && vote[textId].status || 0;
        let up = vote[textId] && vote[textId].up || 0;
        let down = vote[textId] && vote[textId].down || 0;

        if ((status === 1 && type === 'up') || (status === -1 && type === 'down')) {
            return;
        }

        if (token === 'undefined') {
            alert('Please log in to use this function!')
        } else {
            fetch(`https://apidev.auramaze.org/v1/${itemType}/${itemId}/${textType}/${textId}/vote`, {
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
                if (type === 'up') {
                    if (status !== 1) {
                        up++;
                    }
                    if (status === -1) {
                        down--;
                    }
                } else {
                    if (status !== -1) {
                        down++;
                    }
                    if (status === 1) {
                        up--;
                    }
                }
                updateVote(Object.assign(vote, {[textId]: {up: up, down: down, status: type === 'up' ? 1 : -1}}));
            }).catch(function (error) {
                alert('There has been a problem with your fetch operation: ' + error.message);
            });
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

        const {textId} = this.props;

        return (
            <VoteContext.Consumer>
                {({vote, updateVote}) => (
                    <View style={styles.viewStyle}>
                        <TouchableOpacity onPress={() => {
                            this.handleVote('up', vote, updateVote).done()
                        }}>
                            <Image source={thumbs_up} style={[styles.imageStyle,
                                vote[textId] && vote[textId].status === 1 ?
                                    styles.isClicked : styles.notClicked]}/>
                        </TouchableOpacity>
                        <Text style={styles.textStyle}>{vote[textId] && vote[textId].up || 0}</Text>
                        <TouchableOpacity onPress={() => {
                            this.handleVote('down', vote, updateVote).done()
                        }}>
                            <Image source={thumbs_down} style={[styles.imageStyle,
                                vote[textId] && vote[textId].status === -1 ?
                                    styles.isClicked : styles.notClicked]}/>
                        </TouchableOpacity>
                        <Text style={styles.textStyle}>{vote[textId] && vote[textId].down || 0}</Text>
                    </View>)}
            </VoteContext.Consumer>
        )
    }

}

export default ReviewFooter;
