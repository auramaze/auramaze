import React from 'react';
import {StyleSheet, View, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import {OrderedSet} from '../utils';
import ArtizenCard from "../components/artizen-card";
import config from "../config";
import ArtCard from "../components/art-card";


class FollowingArt extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            token: this.props.token,
            searchArt: new OrderedSet([]),
            nextArt: null,
        };
        this.onArtEndReachedCalledDuringMomentum = true;
        this.loadMoreArtHandler = this.loadMoreArtHandler.bind(this);
        this.fetchArt = this.fetchArt.bind(this);
    }

    componentDidMount() {
        this.fetchArt(`${config.API_ENDPOINT}/artizen/${this.props.id}/follow?group=art`);
    }

    fetchArt(url) {
        fetch(url, {
            method: 'GET',
            headers: this.state.token && this.state.token !== 'undefined' && this.state.token !== 'null' ? {
                'Authorization': `Bearer ${this.state.token}`
            } : null
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Get user info fail.');
            }
        }).then((responseJson) => {
                this.setState(previousState => ({
                    nextArt: responseJson.next,
                    searchArt: previousState.searchArt.union(responseJson.data),
                }));
            }
        ).catch(function (error) {
            alert('There has been a problem with your fetch operation: ' + error.message);
        });
    }

    async loadMoreArtHandler() {
        if (!this.onArtEndReachedCalledDuringMomentum && this.state.nextArt) {
            const responseArt = await fetch(this.state.nextArt);
            const responseArtJsonRaw = await responseArt.json();
            this.setState(previousState => ({
                searchArt: previousState.searchArt.union(responseArtJsonRaw.data),
                nextArt: responseArtJsonRaw.next,
            }));
            this.onArtEndReachedCalledDuringMomentum = true;
        }
    }

    render() {

        const styles = StyleSheet.create({
            mainContext: {
                paddingHorizontal: 15, justifyContent: 'center',
            },
            headerText: {
                fontSize: 20,
                color: '#666666',
                fontFamily: this.props.fontLoaded ?
                    ('century-gothic-regular') : 'Cochin',
            },
            bottomLine: {
                borderBottomColor: '#666666',
                borderBottomWidth: 1,
                padding: 5,
            },
            container: {
                paddingVertical: 5,
            }
        });

        let fontLoadStatus = this.props.fontLoaded;

        return (
            <View style={styles.mainContext}>
                <FlatList style={{paddingVertical: 20}}
                          data={this.state.searchArt.toArray()}
                          renderItem={({item}) => (
                              <TouchableOpacity key={item.id}
                                                onPress={() => this.props.navigation.navigate('Art', {
                                                    artId: item.id,
                                                    titleName: item.title.default,
                                                })}>
                                  <ArtCard artName={item.title.default}
                                           artistName={item.artist ? item.artist.default : ""}
                                           source={item.image && item.image.default ? item.image.default.url : null}
                                           compYear={item.completionYear ? item.completionYear : ""}
                                           id={item.id}
                                           fontLoaded={fontLoadStatus}
                                  />
                              </TouchableOpacity>)}
                          onEndReached={this.loadMoreArtHandler}
                          onMomentumScrollBegin={() => {
                              this.onArtEndReachedCalledDuringMomentum = false;
                          }}
                          keyExtractor={(item, index) => index.toString()}/>
            </View>
        );
    }
}

export default FollowingArt;
