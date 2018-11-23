import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Text,
    FlatList,
    AsyncStorage,
    RefreshControl
} from 'react-native';
import {Constants} from 'expo';
import TopSearchBar from "../components/top-search-bar";
import SearchPage from "../components/search-page";
import ArtizenCard from "../components/artizen-card";
import ArtCard from "../components/art-card";
import TitleBar from "../components/title-bar";


class Recommendation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchResult: {hasSearched: false}, recommendation: 'undefined', refreshing: false,
            haveArtizen: false,
            recommendArtizen: [],
            haveArt: false,
            recommendArt: []
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
        let fontLoaded = this.props.screenProps.fontLoaded;
        let token = await AsyncStorage.getItem('token').catch((err) => {
            alert(err);
        });

        fetch(`https://apidev.auramaze.org/v1/recommend`, {
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
        }).then((responseJson) => {
            let returnArtizen = responseJson.artizen.length >= 1;
            let returnArt = responseJson.art.length >= 1;
            let artizenArray = [];

            responseJson.artizen.map((item, key) => {
                artizenArray.push(
                    <TouchableOpacity key={key}
                                      onPress={() => this.props.navigation.navigate('Artizen', {
                                          artizenId: item.id,
                                          titleName: item.name.default,
                                      })}>
                        <ArtizenCard name={item.name.default ? item.name.default : ""}
                                     source={item.avatar ? item.avatar : null}
                                     id={item.id}
                                     topMargin={0}
                                     fontLoaded={fontLoaded}/>
                    </TouchableOpacity>)
            });

            let artizenArrays = [], size = 2;
            while (artizenArray.length > 0)
                artizenArrays.push(artizenArray.splice(0, size));

            this.setState(previousState => ({
                recommendation: 'defined',
                haveArtizen: returnArtizen,
                recommendArtizen: artizenArrays,
                haveArt: returnArt,
                recommendArt: responseJson.art.map((item, key) => {
                    return (
                        <TouchableOpacity
                            key={key}
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
                        </TouchableOpacity>
                    );
                })
            }));
        }).catch(function (error) {
            this.setState(previousState => ({auramazeProcessing: false}));
            alert('There has been a problem with your fetch operation: ' + error.message);
        });

    }

    updateSearchStatus = (info) => {
        this.setState(previousState => (
            {searchResult: info}
        ));
    };

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
                    this.state.recommendation !== 'undefined' ?
                        <ScrollView keyboardDismissMode='on-drag'
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={this._onRefresh}
                                        />
                                    }>
                            {this.state.haveArtizen ?
                                <View style={{marginHorizontal: 5}}>
                                    <TitleBar titleText={"Artizen"} fontLoaded={this.props.screenProps.fontLoaded}/>
                                </View> : null}
                            <FlatList data={this.state.recommendArtizen}
                                      horizontal={true}
                                      showsHorizontalScrollIndicator={false}
                                      renderItem={({item}) => SearchPage.renderRow(item)}
                                      keyExtractor={(item, index) => index.toString()}/>

                            {this.state.haveArtizen ? <View style={{height: 20}}/> : null}
                            {this.state.haveArt ?
                                <View style={{marginHorizontal: 5}}>
                                    <TitleBar titleText={"Art"} fontLoaded={this.props.screenProps.fontLoaded}/>
                                </View> : null}
                            <View style={{flex: 1, alignItems: 'center', paddingBottom: 60}}>
                                {this.state.recommendArt}
                            </View>
                        </ScrollView> : null}
            </View>
        );
    }
}

export default Recommendation;
