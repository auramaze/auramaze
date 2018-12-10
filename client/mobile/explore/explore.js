import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
    Text, Dimensions
} from 'react-native';
import {Constants, Location, Permissions} from 'expo';
import {OrderedSet} from '../utils';
import TopSearchBar from "../components/top-search-bar";
import TitleBar from "../components/title-bar";
import config from "../config.json";
import ArtizenCard from "../components/artizen-card";
import AutoHeightImage from "react-native-auto-height-image";
import logoIcon from "../assets/auramaze-logo.png";
import locIcon from "../assets/icons/location-arrow.png";
import plusIcon from "../assets/icons/plus-solid.png";


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
                marginTop: Constants.statusBarHeight,
            },
            mainContext: {
                paddingHorizontal: 15, justifyContent: 'center',
            },
            buttonGeneral: {
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('window').width - 40,
                height: 45,
                marginVertical: 10,
                borderWidth: 1
            },
            buttonAuraMaze: {
                backgroundColor: '#666666',
                borderColor: '#666666',
                marginBottom: 40
            },
            textGeneral: {
                textAlign: 'center',
                paddingHorizontal: 10,
                fontSize: 15
            },
            textWhite: {color: 'white'},
            infoText: {
                fontSize: 15,
                paddingHorizontal: 20,
                color: '#666666',
                textAlign: 'center',
                marginVertical: 25,
            },
            headerText: {
                fontSize: 30,
                paddingHorizontal: 20,
                color: 'black',
                textAlign: 'center'
            }
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
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    height: 200,
                                    verticalAlign: 'center'
                                }}>
                                <AutoHeightImage source={logoIcon} width={100}
                                                 style={{tintColor: '#666666', marginLeft: 40}}/>
                                <AutoHeightImage source={plusIcon} width={20}
                                                 style={{tintColor: '#666666', marginHorizontal: 20}}/>
                                <AutoHeightImage source={locIcon} width={90}
                                                 style={{tintColor: 'tomato', marginRight: 40}}/>
                            </View>
                            <Text style={styles.headerText}>
                                Welcome to AuraMaze Explore!
                            </Text>
                            <Text style={styles.infoText}>
                                Let AuraMaze access your current location to explore nearby museums!
                            </Text>
                            {this.state.askedPermission ?
                                <TouchableOpacity
                                    style={[styles.buttonGeneral, styles.buttonAuraMaze]}
                                    onPress={async () => {
                                        await this._loadExplore();
                                    }}
                                    underlayColor='#fff'>
                                    <Text style={[styles.textGeneral, styles.textWhite]}>
                                        Enable in Settings and reload
                                    </Text>
                                </TouchableOpacity> :
                                <TouchableOpacity
                                    style={[styles.buttonGeneral, styles.buttonAuraMaze]}
                                    onPress={async () => {
                                        await this._loadExplore();
                                    }}
                                    underlayColor='#fff'>
                                    <Text style={[styles.textGeneral, styles.textWhite]}>Enable Access</Text>
                                </TouchableOpacity>}
                        </View>}
                </View>
            </View>
        );
    }
}

export default Explore;
