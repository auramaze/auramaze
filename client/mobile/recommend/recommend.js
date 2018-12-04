import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    FlatList,
    RefreshControl
} from 'react-native';
import {Constants} from 'expo';
import {OrderedSet} from 'immutable';
import TopSearchBar from "../components/top-search-bar";
import ArtCard from "../components/art-card";
import TitleBar from "../components/title-bar";
import config from "../config.json";
import {withAuth} from "../App";
import MessageCard from "../components/message-card";
import {withNavigation} from "react-navigation";


class Recommend extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            recommendArt: OrderedSet([]), recommendNext: null
        };
        this._loadRecommend = this._loadRecommend.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    componentDidMount() {
        this._loadRecommend().done();
    }

    componentDidUpdate(prevProps) {
        const prevId = prevProps.auth.id;
        const {id} = this.props.auth;

        if (prevId !== id) {
            this._loadRecommend().done();
        }
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true
        });
        this._loadRecommend().then(() => {
            this.setState({refreshing: false});
        });
    };

    async _loadRecommend() {
        const {id, token} = this.props.auth;

        if (id) {
            let fontLoaded = this.props.screenProps.fontLoaded;

            fetch(`${config.API_ENDPOINT}/recommend`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                }
            }).then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Get recommendation.');
                }
            }).then((responseJsonRaw) => {
                let responseJson = responseJsonRaw.data;
                let artArray = [];
                responseJson.map((item) => {
                    artArray.push(
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => this.props.navigation.navigate('Art', {
                                artId: item.id,
                                titleName: item.title.default,
                            })}>
                            <ArtCard
                                artName={item.title && item.title.default}
                                artistName={item.artist && item.artist.default}
                                source={item.image && item.image.default && item.image.default.url}
                                compYear={item.completionYear}
                                id={item.id}
                                fontLoaded={fontLoaded}
                            />
                        </TouchableOpacity>)
                });

                this.setState({
                    recommendNext: responseJsonRaw.next,
                    recommendArt: OrderedSet(artArray)
                });
            }).catch(function (error) {
                alert('There has been a problem with your fetch operation: ' + error.message);
            });
        }
    }

    render() {

        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1, alignItems: 'center',
                paddingTop: Constants.statusBarHeight,
            },
            mainContext: {
                paddingHorizontal: 15, justifyContent: 'center',
            },
        });

        return (
            <View style={styles.mainStruct}>

                <TopSearchBar navigation={this.props.navigation}
                              fontLoaded={this.props.screenProps.fontLoaded}/>
                <View style={styles.mainContext}>

                    <ScrollView keyboardDismissMode='on-drag'
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh}
                                    />
                                }>
                        {this.state.recommendArt ?
                            <View style={{marginHorizontal: 5}}>
                                <TitleBar titleText={"Recommend Artworks"}
                                          fontLoaded={this.props.screenProps.fontLoaded}/>
                            </View> : null}
                        {this.state.recommendArt.size ?
                            <View
                                style={{flex: 1, alignItems: 'center', paddingBottom: 60}}>
                                <FlatList data={this.state.recommendArt.toArray()}
                                          renderItem={({item}) => item}
                                          keyExtractor={(item, index) => index.toString()}/>
                            </View> :
                            <MessageCard fontLoaded={this.props.screenProps.fontLoaded}
                                         text={this.props.auth.id ? 'Please view some arts to get recommendation.' : 'Please log in to view recommendation!'}
                                         onPress={() => {
                                             this.props.navigation.navigate('User');
                                         }}/>}}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

export default withNavigation(withAuth(Recommend));
