import React from 'react';
import {StyleSheet, View, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import {OrderedSet} from '../utils';
import ArtizenCard from "../components/artizen-card";
import config from "../config";


class FollowingArtizen extends React.Component {

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.state = {
            id: this.props.id,
            token: this.props.token,
            searchArtizen: new OrderedSet([]),
            nextArtizen: null,
        };
        this.onArtizenEndReachedCalledDuringMomentum = true;
        this.loadMoreArtizenHandler = this.loadMoreArtizenHandler.bind(this);
        this.fetchArtizen = this.fetchArtizen.bind(this);
    }

    componentDidMount() {
        this.fetchArtizen(`${config.API_ENDPOINT}/artizen/${this.props.id}/follow?group=artizen`);
    }

    fetchArtizen(url) {
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
                    nextArtizen: responseJson.next,
                    searchArtizen: previousState.searchArtizen.union(responseJson.data),
                }));
            }
        ).catch(function (error) {
            alert('There has been a problem with your fetch operation: ' + error.message);
        });
    }

    async loadMoreArtizenHandler() {
        if (!this.onArtizenEndReachedCalledDuringMomentum && this.state.nextArtizen) {
            const responseArtizen = await fetch(this.state.nextArtizen);
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
                          data={this.state.searchArtizen.toArray()}
                          renderItem={({item}) => (
                              <TouchableOpacity key={item.id}
                                                onPress={() => this.props.navigation.navigate('Artizen', {
                                                    artizenId: item.id,
                                                    titleName: item.name.default,
                                                })}>
                                  <ArtizenCard name={item.name.default ? item.name.default : ""}
                                               source={item.avatar ? item.avatar : null}
                                               id={item.id}
                                               topMargin={0}
                                               fontLoaded={fontLoadStatus}/>
                              </TouchableOpacity>)}
                          onEndReached={this.loadMoreArtizenHandler}
                          onMomentumScrollBegin={() => {
                              this.onArtizenEndReachedCalledDuringMomentum = false;
                          }}
                          keyExtractor={(item, index) => index.toString()}/>
            </View>
        );
    }
}

export default FollowingArtizen;
