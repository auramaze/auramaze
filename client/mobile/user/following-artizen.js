import React from 'react';
import {StyleSheet, View, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import {OrderedSet} from '../utils';
import ArtizenCard from "../components/artizen-card";
import config from "../config";
import {withAuth} from "../App";


class FollowingArtizen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchArtizen: new OrderedSet([]),
            nextArtizen: null,
            refreshing: false
        };
        this.onArtizenEndReachedCalledDuringMomentum = true;
        this.refreshArtizenHandler = this.refreshArtizenHandler.bind(this);
        this.loadMoreArtizenHandler = this.loadMoreArtizenHandler.bind(this);
        this.fetchArtizen = this.fetchArtizen.bind(this);
    }

    componentDidMount() {
        const {id} = this.props.auth;

        if (id) {
            this.fetchArtizen().done();
        }
    };

    componentDidUpdate(prevProps) {
        const prevId = prevProps.auth.id;
        const {id} = this.props.auth;

        if (prevId !== id) {
            this.fetchArtizen().done();
        }
    }

    async fetchArtizen() {
        const {id, token} = this.props.auth;

        if (id) {
            const responseArtizen = await fetch(`${config.API_ENDPOINT}/artizen/${id}/follow?group=artizen`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const responseArtizenJsonRaw = await responseArtizen.json();
            this.setState({
                searchArtizen: new OrderedSet(responseArtizenJsonRaw.data),
                nextArtizen: responseArtizenJsonRaw.next,
            });
        }
    }

    async refreshArtizenHandler() {
        this.setState({refreshing: true});
        const {id} = this.props.auth;

        if (id) {
            this.fetchArtizen().done();
        }
        this.setState({refreshing: false});
    }

    async loadMoreArtizenHandler() {
        const {id, token} = this.props.auth;

        if (!this.onArtizenEndReachedCalledDuringMomentum && this.state.nextArtizen && id) {
            const responseArtizen = await fetch(this.state.nextArtizen, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const responseArtizenJsonRaw = await responseArtizen.json();
            this.setState(previousState => ({
                searchArtizen: previousState.searchArtizen.union(responseArtizenJsonRaw.data),
                nextArtizen: responseArtizenJsonRaw.next,
            }));
            this.onArtizenEndReachedCalledDuringMomentum = true;
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
                          data={this.state.searchArtizen.toArray().concat([{}])}
                          renderItem={({item}) => item.id ? (
                              <TouchableOpacity key={item.id}
                                                onPress={() => this.props.navigation.navigate('Artizen', {
                                                    artizenId: item.artizen_id,
                                                    titleName: item.name.default,
                                                })}>
                                  <ArtizenCard name={item.name.default ? item.name.default : ""}
                                               source={item.avatar ? item.avatar : null}
                                               id={item.id}
                                               topMargin={10}
                                               fontLoaded={fontLoadStatus}/>
                              </TouchableOpacity>) : <View style={{height: 100}}/>}
                          onRefresh={this.refreshArtizenHandler}
                          refreshing={this.state.refreshing}
                          onEndReached={this.loadMoreArtizenHandler}
                          onEndReachedThreshold={0}
                          onMomentumScrollBegin={() => {
                              this.onArtizenEndReachedCalledDuringMomentum = false;
                          }}
                          keyExtractor={(item, index) => index.toString()}/>
            </View>
        );
    }
}

export default withAuth(FollowingArtizen);
