import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import {Constants} from 'expo';
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
        };
        this.onExploreEndReachedCalledDuringMomentum = true;
        this._loadExplore = this._loadExplore.bind(this);
        this._loadMoreExploreHandler = this._loadMoreExploreHandler.bind(this);
    }

    async componentDidMount() {
        this._loadExplore(`${config.API_ENDPOINT}/explore?longitude=-83.7113&latitude=42.3241`).done();
    }

    async _loadExplore(url) {
        const responseExplore = await fetch(url, {
            method: 'GET',
        });
        const responseExploreJsonRaw = await responseExplore.json();
        this.setState(previousState => ({
            searchArtizen: previousState.exploreMuseum.union(responseExploreJsonRaw.data),
            nextMuseum: responseExploreJsonRaw.next,
        }));
    }

    async _loadMoreExploreHandler() {
        if (!this.onExploreEndReachedCalledDuringMomentum && this.state.nextMuseum) {
            this._loadExplore(this.state.nextMuseum).done();
            this.onExploreEndReachedCalledDuringMomentum = true;
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

                    <FlatList data={[
                        <View style={{marginHorizontal: 5}}>
                            <TitleBar titleText={"Explore Nearby Museums"}
                                      fontLoaded={this.props.screenProps.fontLoaded}/>
                        </View>,
                        ...this.state.exploreMuseum.map(item =>
                            <TouchableOpacity key={item.id}
                                              onPress={() => this.props.navigation.navigate('Artizen', {
                                                  artizenId: item.artizen_id,
                                                  titleName: item.name.default,
                                              })}>
                                <ArtizenCard name={item.name.default ? item.name.default : ""}
                                             source={item.avatar ? item.avatar : null}
                                             id={item.id}
                                             info={item.distance}
                                             topMargin={10}
                                             fontLoaded={this.props.screenProps.fontLoaded}/>
                            </TouchableOpacity>)
                    ]}
                              renderItem={({item}) => item}
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
