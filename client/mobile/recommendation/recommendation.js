import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    FlatList,
    AsyncStorage,
    RefreshControl
} from 'react-native';
import {Constants} from 'expo';
import {OrderedSet} from 'immutable';
import TopSearchBar from "../components/top-search-bar";
import SearchPage from "../components/search-page";
import ArtCard from "../components/art-card";
import TitleBar from "../components/title-bar";
import config from "../config.json";


class Recommendation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchResult: {hasSearched: false}, recommendation: 'undefined', refreshing: false,
            recommendArt: OrderedSet([]), recommendNext: null, hasLoaded: false
        };
        this.updateSearchStatus = this.updateSearchStatus.bind(this);
        this._loadRecommend = this._loadRecommend.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    async componentDidMount() {
        this._loadRecommend().done();
    }

    _onRefresh = () => {
        this.setState({
            refreshing: true, recommendation: 'undefined'
        });
        this._loadRecommend().then(() => {
            this.setState({refreshing: false});
        });
    };

    async _loadRecommend() {
        this.setState({
            hasLoaded: false
        });
        let fontLoaded = this.props.screenProps.fontLoaded;
        let token = await AsyncStorage.getItem('token', null).catch((err) => {
            alert(err);
        });

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
                            artName={item.title.default}
                            artistName={item.artist ? item.artist.default : ""}
                            source={item.image && item.image.default ? item.image.default.url : null}
                            compYear={item.completionYear ? item.completionYear : ""}
                            id={item.id}
                            fontLoaded={fontLoaded}
                        />
                    </TouchableOpacity>)
            });

            this.setState({
                recommendation: 'defined',
                recommendNext: responseJsonRaw.next,
                recommendArt: OrderedSet(artArray),
                hasLoaded: true
            });
        }).catch(function (error) {
            alert('There has been a problem with your fetch operation: ' + error.message);
        });

    }

    updateSearchStatus = (info) => {
        this.setState({searchResult: info});
    };

    async loadMoreHandler() {
        if (!this.state.hasLoaded) return;
        this.setState({
            hasLoaded: false
        });
        try {
            let token = await AsyncStorage.getItem('token', null);
            let recommendInfo = await fetch(this.state.recommendNext, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                }
            });
            let recommendInfoJsonRaw = await recommendInfo.json();
            this.setState(previousState => ({
                recommendArt: previousState.recommendArt.union(OrderedSet(recommendInfoJsonRaw.data)),
                recommendNext: recommendInfoJsonRaw.next,
                hasLoaded: true
            }));
        } catch (error) {
            alert(error);
        }
    }

    render() {

        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1, alignItems: 'center',
                paddingTop: Constants.statusBarHeight,
            }
        });

        return (
            <View style={styles.mainStruct}>

                <TopSearchBar updateSearchStatus={this.updateSearchStatus}
                              navigation={this.props.navigation}
                              fontLoaded={this.props.screenProps.fontLoaded}/>

                {this.state.searchResult.hasSearched ?
                    <SearchPage searchResult={this.state.searchResult}
                                fontLoaded={this.props.screenProps.fontLoaded}/> :

                    <ScrollView keyboardDismissMode='on-drag'
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh}
                                    />
                                }>
                        {this.state.recommendArt ?
                            <View style={{marginHorizontal: 5}}>
                                <TitleBar titleText={"Art"} fontLoaded={this.props.screenProps.fontLoaded}/>
                            </View> : null}
                        this.state.recommendation !== 'undefined' ? <View
                        style={{flex: 1, alignItems: 'center', paddingBottom: 60}}>
                        <FlatList data={this.state.recommendArt.toArray()}
                                  renderItem={({item}) => item}
                                  onEndReached={this.loadMoreHandler}
                                  onEndThreshold={0}
                                  keyExtractor={(item, index) => index.toString()}/>
                    </View>: null
                    </ScrollView>}
            </View>
        );
    }
}

export default Recommendation;
