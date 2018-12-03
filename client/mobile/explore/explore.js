import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import {Constants, Location, Permissions} from 'expo';
import {OrderedSet} from '../utils';
import TopSearchBar from "../components/top-search-bar";
import TitleBar from "../components/title-bar";
import config from "../config.json";
import ArtizenCard from "../components/artizen-card";


class Explore extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            exploreMuseum: new OrderedSet([]),
            nextMuseum: null,
            refreshing: false
        };
        this.onExploreEndReachedCalledDuringMomentum = true;
        this._loadExplore = this._loadExplore.bind(this);
        this._loadMoreExploreHandler = this._loadMoreExploreHandler.bind(this);
        this._getLocationAsync = this._getLocationAsync.bind(this);
        this.refreshHandler = this.refreshHandler.bind(this);
    }

    _getLocationAsync = async () => {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return null;
        }
        return await Location.getCurrentPositionAsync({});
    };

    async componentDidMount() {
        this._loadExplore().done();
    }

    async _loadExplore() {
        const locInfo = await this._getLocationAsync();
        if (!locInfo) return;
        const responseExplore = await fetch(`${config.API_ENDPOINT}/explore?longitude=${locInfo.coords.longitude}&latitude=${locInfo.coords.latitude}`);
        const responseExploreJsonRaw = await responseExplore.json();
        this.setState({
            exploreMuseum: new OrderedSet(responseExploreJsonRaw.data),
            nextMuseum: responseExploreJsonRaw.next,
        });
    }

    async _loadMoreExploreHandler() {
        if (!this.onExploreEndReachedCalledDuringMomentum && this.state.nextMuseum) {
            const responseExplore = await fetch(this.state.nextMuseum);
            const responseExploreJsonRaw = await responseExplore.json();
            this.setState(previousState => ({
                exploreMuseum: previousState.exploreMuseum.union(responseExploreJsonRaw.data),
                nextMuseum: responseExploreJsonRaw.next,
            }));
            this.onExploreEndReachedCalledDuringMomentum = true;
        }
    }

    async refreshHandler() {
        this.setState({refreshing: true});
        this._loadExplore().done();
        this.setState({refreshing: false});
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

                    <FlatList data={[
                        <View style={{marginHorizontal: 5}}>
                            <TitleBar titleText={"Explore Nearby Museums"}
                                      fontLoaded={this.props.screenProps.fontLoaded}/>
                        </View>,
                        ...this.state.exploreMuseum.map(item =>
                            <TouchableOpacity key={item.id}
                                              onPress={() => this.props.navigation.navigate('Artizen', {
                                                  artizenId: item.id,
                                                  titleName: item.name.default,
                                              })}>
                                <ArtizenCard name={item.name.default ? item.name.default : ""}
                                             source={item.avatar ? item.avatar : null}
                                             id={item.id}
                                             showLoc={
                                                 {distance: item.distance, address: item.address}
                                             }
                                             topMargin={10}
                                             fontLoaded={this.props.screenProps.fontLoaded}/>
                            </TouchableOpacity>)
                    ]}
                              renderItem={({item}) => item}
                              onRefresh={this.refreshHandler}
                              refreshing={this.state.refreshing}
                              onEndReached={this._loadMoreExploreHandler}
                              onEndReachedThreshold={0}
                              onMomentumScrollBegin={() => {
                                  this.onExploreEndReachedCalledDuringMomentum = false;
                              }}
                              keyExtractor={(item, index) => index.toString()}/>
                </View>
            </View>
        );
    }
}

export default Explore;
