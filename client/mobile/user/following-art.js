import React from 'react';
import {StyleSheet, View, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import {checkResponseStatus, OrderedSet} from '../utils';
import ArtCard from "../components/art-card";
import config from "../config";
import {withAuth} from "../App";
import MessageCard from "../components/message-card";
import {Constants} from "expo";


class FollowingArt extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchArt: new OrderedSet([]),
            nextArt: null,
            refreshing: false
        };
        this.onArtEndReachedCalledDuringMomentum = true;
        this.refreshArtHandler = this.refreshArtHandler.bind(this);
        this.loadMoreArtHandler = this.loadMoreArtHandler.bind(this);
        this.fetchArt = this.fetchArt.bind(this);
    }

    componentDidMount() {
        const {id} = this.props.auth;

        if (id) {
            this.fetchArt().done();
        }
    };

    componentDidUpdate(prevProps) {
        const prevId = prevProps.auth.id;
        const {id} = this.props.auth;

        if (prevId !== id) {
            this.fetchArt().done();
        }
    }

    async fetchArt() {
        const {id, token} = this.props.auth;

        if (id) {
            const responseArt = await fetch(`${config.API_ENDPOINT}/artizen/${id}/follow?group=art`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!await checkResponseStatus(responseArt, this.props.auth.removeAuth)) {
                return;
            }
            const responseArtJsonRaw = await responseArt.json();
            this.setState({
                searchArt: new OrderedSet(responseArtJsonRaw.data),
                nextArt: responseArtJsonRaw.next,
            });
        }
    }

    async refreshArtHandler() {
        this.setState({refreshing: true});
        const {id} = this.props.auth;

        if (id) {
            this.fetchArt().done();
        }
        this.setState({refreshing: false});
    }

    async loadMoreArtHandler() {
        const {id, token} = this.props.auth;

        if (!this.onArtEndReachedCalledDuringMomentum && this.state.nextArt && id) {
            const responseArt = await fetch(this.state.nextArt, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!await checkResponseStatus(responseArt, this.props.auth.removeAuth)) {
                return;
            }
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
            mainStruct: {
                flex: 1, alignItems: 'center',
            },
            mainContext: {
                justifyContent: 'center',
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
            }
        });

        let fontLoadStatus = this.props.fontLoaded;

        return (
            <View style={styles.mainStruct}>

                <View style={styles.mainContext}>
                    {this.state.searchArt.size ?
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
                                                   image={item.image}
                                                   compYear={item.completionYear ? item.completionYear : ""}
                                                   id={item.id}
                                                   fontLoaded={fontLoadStatus}
                                          />
                                      </TouchableOpacity>) : <View style={{height: 100}}/>}
                                  onRefresh={this.refreshArtHandler}
                                  refreshing={this.state.refreshing}
                                  onEndReached={this.loadMoreArtHandler}
                                  onEndReachedThreshold={0}
                                  onMomentumScrollBegin={() => {
                                      this.onArtEndReachedCalledDuringMomentum = false;
                                  }}
                                  keyExtractor={(item, index) => index.toString()}/> :
                        <FlatList data={[
                            <MessageCard fontLoaded={fontLoadStatus}
                                         text={'You haven\'t followed any art yet.'}
                                         onPress={() => {
                                             this.props.navigation.push('Explore');
                                         }}/>
                        ]}
                                  renderItem={({item}) => item}
                                  onRefresh={this.refreshArtHandler}
                                  refreshing={this.state.refreshing}
                                  keyExtractor={(item, index) => index.toString()}/>
                    }
                </View>
            </View>
        );
    }
}

export default withAuth(FollowingArt);
