import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    Text
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
            refreshing: false,
            hasPermission: false,
            askedPermission: false
        };
        this.onExploreEndReachedCalledDuringMomentum = true;
        this._loadExplore = this._loadExplore.bind(this);
        this._loadMoreExploreHandler = this._loadMoreExploreHandler.bind(this);
        this._getLocationAsync = this._getLocationAsync.bind(this);
        this.refreshHandler = this.refreshHandler.bind(this);
    }

    _getLocationAsync = async () => {
        const {status} = await Permissions.askAsync(Permissions.LOCATION);

        if (status === 'granted') {
            this.setState({hasPermission: true, askedPermission: true});
            return await Location.getCurrentPositionAsync({});
        } else {
            this.setState({hasPermission: false, askedPermission: true});
            return null;
        }
    };

    async componentDidMount() {
        const {status} = await Permissions.getAsync(Permissions.LOCATION);
        if (status === 'granted') {
            this.setState({hasPermission: true, askedPermission: true});
            await this._loadExplore();
        }
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
        await this._loadExplore();
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
                    {this.state.hasPermission ?
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
                                  keyExtractor={(item, index) => index.toString()}/> :
                        this.state.askedPermission ?
                            <TouchableOpacity onPress={async () => {
                                await this._loadExplore();
                            }}>
                                <Text>Please go to Settings to enable location.</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={async () => {
                                await this._loadExplore();
                            }}>
                                <Text>has not asked permission</Text>
                            </TouchableOpacity>}
                </View>
            </View>
        );
    }
}

export default Explore;
