import React from 'react';
import {StyleSheet, View, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import {isAuthValid, OrderedSet} from '../utils';
import ArtCard from "../components/art-card";
import config from "../config";


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
        const {id} = this.props;

        if (isAuthValid(id)) {
            this.fetchArt(`${config.API_ENDPOINT}/artizen/${id}/follow?group=art`).done();
        }
    };

    componentDidUpdate(prevProps) {
        const prevId = prevProps.id;
        const {id} = this.props;

        if (!isAuthValid(prevId) && isAuthValid(id)) {
            this.fetchArt(`${config.API_ENDPOINT}/artizen/${id}/follow?group=art`).done();
        }
    }

    async fetchArt(url) {
        const {id, token} = this.props;
        const responseArt = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const responseArtJsonRaw = await responseArt.json();
        this.setState(previousState => ({
            searchArt: previousState.searchArt.union(responseArtJsonRaw.data),
            nextArt: responseArtJsonRaw.next,
        }));
    }

    async loadMoreArtHandler() {
        if (!this.onArtEndReachedCalledDuringMomentum && this.state.nextArt) {
            this.fetchArt(this.state.nextArt).done();
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
                          data={this.state.searchArt.toArray().concat([{}])}
                          renderItem={({item}) => item.id ? (
                              <TouchableOpacity key={item.id}
                                                onPress={() => this.props.navigation.navigate('Art', {
                                                    artId: item.art_id,
                                                    titleName: item.title.default,
                                                })}>
                                  <ArtCard artName={item.title.default}
                                           artistName={item.artist ? item.artist.default : ""}
                                           source={item.image && item.image.default ? item.image.default.url : null}
                                           compYear={item.completionYear ? item.completionYear : ""}
                                           id={item.id}
                                           fontLoaded={fontLoadStatus}
                                  />
                              </TouchableOpacity>) : <View style={{height: 100}}/>}
                          onEndReached={this.loadMoreArtHandler}
                          onEndReachedThreshold={0}
                          onMomentumScrollBegin={() => {
                              this.onArtEndReachedCalledDuringMomentum = false;
                          }}
                          keyExtractor={(item, index) => index.toString()}/>
            </View>
        );
    }
}

export default FollowingArt;
