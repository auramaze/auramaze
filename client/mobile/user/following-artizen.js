import React from 'react';
import {StyleSheet, View, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import {isAuthValid, OrderedSet} from '../utils';
import ArtizenCard from "../components/artizen-card";
import config from "../config";


class FollowingArtizen extends React.Component {

    constructor(props) {
        super(props);
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
        const {id} = this.props;

        if (isAuthValid(id)) {
            this.fetchArtizen(`${config.API_ENDPOINT}/artizen/${id}/follow?group=artizen`).done();
        }
    };

    componentDidUpdate(prevProps) {
        const prevId = prevProps.id;
        const {id} = this.props;

        if (!isAuthValid(prevId) && isAuthValid(id)) {
            this.fetchArtizen(`${config.API_ENDPOINT}/artizen/${id}/follow?group=artizen`).done();
        }
    }

    async fetchArtizen(url) {
        const {id, token} = this.props;

        const responseArtizen = await fetch(url, {
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
    }

    async loadMoreArtizenHandler() {
        if (!this.onArtizenEndReachedCalledDuringMomentum && this.state.nextArtizen) {
            this.fetchArtizen(this.state.nextArtizen).done();
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

export default FollowingArtizen;
