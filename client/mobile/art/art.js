import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Text, AsyncStorage} from 'react-native';
import {OrderedSet} from 'immutable';
import ReviewCard from "../components/review-card";
import ArtInfo from "../components/art-info";
import TitleBar from "../components/title-bar";
import ArtizenCard from "../components/artizen-card";
import config from "../config.json";

class Art extends React.Component {

    constructor(props) {
        super(props);
        this._loadInitialState = this._loadInitialState.bind(this);
    }

    state = {artId: 0, introductions: OrderedSet(), reviews: OrderedSet()};

    async _loadInitialState() {
        try {
            const {navigation} = this.props;

            let token = await AsyncStorage.getItem('token');
            const artId = navigation.getParam('artId', 0);
            let artInfo = await fetch(`${config.API_ENDPOINT}/art/${artId}`, {
                method: 'GET',
                headers: token && token !== 'undefined' && token !== 'null' ? {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                } : null
            });

            let introInfo = await fetch(`${config.API_ENDPOINT}/art/${artId}/introduction`, {
                method: 'GET',
                headers: token && token !== 'undefined' && token !== 'null' ? {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                } : null
            });
            let artizenInfo = await fetch(`${config.API_ENDPOINT}/art/${artId}/artizen`);
            let reviewInfo = await fetch(`${config.API_ENDPOINT}/art/${artId}/review`, {
                method: 'GET',
                headers: token && token !== 'undefined' && token !== 'null' ? {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                } : null
            });
            let artInfoJson = await artInfo.json();
            let artizenInfoJson = await artizenInfo.json();
            let introInfoJsonRaw = await introInfo.json();
            let reviewInfoJsonRaw = await reviewInfo.json();
            let introInfoJson = introInfoJsonRaw.data;
            let reviewInfoJson = reviewInfoJsonRaw.data;
            let fontLoadStatus = this.props.screenProps.fontLoaded;

            artizenInfoJson.map((item, key) => {
                if (item.type === "artist") {
                    this.setState(previousState => (
                        {
                            hasArtists: true,
                            artists: item.data.map((artistItem, artistKey) => {
                                return (
                                    <TouchableOpacity
                                        key={artistKey}
                                        onPress={() => this.props.navigation.push('Artizen', {
                                            artizenId: artistItem.id,
                                            titleName: artistItem.name.default,
                                        })}>
                                        <ArtizenCard
                                            name={artistItem.name.default}
                                            source={artistItem.avatar}
                                            topMargin={15}
                                            fontLoaded={fontLoadStatus}/>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    ));
                } else if (item.type === "museum") {
                    this.setState(previousState => (
                        {
                            hasMuseums: true,
                            museums: item.data.map((museumItem, museumKey) => {
                                return (
                                    <TouchableOpacity
                                        key={museumKey}
                                        onPress={() => this.props.navigation.push('Artizen', {
                                            artizenId: museumItem.id,
                                            titleName: museumItem.name.default,
                                        })}>
                                        <ArtizenCard
                                            name={museumItem.name.default}
                                            source={museumItem.avatar}
                                            topMargin={15}
                                            fontLoaded={fontLoadStatus}/>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    ));
                } else if (item.type === "genre") {
                    this.setState(previousState => (
                        {
                            hasGenres: true,
                            genres: item.data.map((genreItem, genreKey) => {
                                return (
                                    <TouchableOpacity
                                        key={genreKey}
                                        onPress={() => this.props.navigation.push('Artizen', {
                                            artizenId: genreItem.id,
                                            titleName: genreItem.name.default,
                                        })}>
                                        <ArtizenCard
                                            name={genreItem.name.default}
                                            source={genreItem.avatar}
                                            topMargin={15}
                                            fontLoaded={fontLoadStatus}/>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    ));
                } else if (item.type === "style") {
                    this.setState(previousState => (
                        {
                            hasStyles: true,
                            styles: item.data.map((styleItem, styleKey) => {
                                return (
                                    <TouchableOpacity
                                        key={styleKey}
                                        onPress={() => this.props.navigation.push('Artizen', {
                                            artizenId: styleItem.id,
                                            titleName: styleItem.name.default,
                                        })}>
                                        <ArtizenCard
                                            name={styleItem.name.default}
                                            source={styleItem.avatar}
                                            topMargin={15}
                                            fontLoaded={fontLoadStatus}/>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    ));
                }
            });

            this.setState(previousState => (
                {
                    artId: artId,
                    art: <ArtInfo fontLoaded={fontLoadStatus}
                                  url={artInfoJson.image.default.url} title={artInfoJson.title.default}/>,
                    introductions: OrderedSet(introInfoJson),
                    reviews: OrderedSet(reviewInfoJson)
                }
            ));
        } catch (error) {
            alert(error);
        }
    }

    async componentDidMount() {
        this._loadInitialState().done();
    }

    render() {

        let fontLoadStatus = this.props.screenProps.fontLoaded;

        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1, flexDirection: 'column',
                // paddingTop: Constants.statusBarHeight,
            },
            mainContext: {
                margin: 20,
                flex: 1, flexDirection: 'column',
            },
            headerText: {
                fontSize: 20,
                color: '#666666',
                fontFamily: fontLoadStatus ? ('century-gothic-regular') : 'Cochin',
            },
            bottomLine: {
                borderBottomColor: '#666666',
                borderBottomWidth: 1,
                padding: 5,
            },
        });

        return (
            <View style={styles.mainStruct}>
                <ScrollView>

                    {this.state.art}
                    <View style={styles.mainContext}>

                        <TitleBar titleText={"Introduction"} fontLoaded={fontLoadStatus}/>
                        {this.state.introductions.map(item => (
                            <ReviewCard key={item.id}
                                        name={item.author_name ? item.author_name.default : ""}
                                        authorId={item.author_id}
                                        source={item.author_avatar ? item.author_avatar : ""}
                                        content={item.content}
                                        itemId={this.state.artId} itemType={'art'}
                                        textId={item.id} textType={'introduction'}
                                        isIntro={true} up={item.up} down={item.down}
                                        status={item.status}
                                        fontLoaded={fontLoadStatus}/>
                        ))}

                        {this.state.hasArtists ? <TitleBar titleText={"Artist"} fontLoaded={fontLoadStatus}/> : null}
                        {this.state.artists}

                        {this.state.hasMuseums ? <TitleBar titleText={"Museum"} fontLoaded={fontLoadStatus}/> : null}
                        {this.state.museums}

                        {this.state.hasGenres ? <TitleBar titleText={"Genre"} fontLoaded={fontLoadStatus}/> : null}
                        {this.state.genres}

                        {this.state.hasStyles ? <TitleBar titleText={"Style"} fontLoaded={fontLoadStatus}/> : null}
                        {this.state.styles}

                        <View style={{height: 30}}/>
                        <TitleBar titleText={"Reviews"}
                                  fontLoaded={fontLoadStatus}
                                  itemType={"art"}
                                  textType={"review"}
                                  itemId={this.state.artId}
                                  reloadFunc={this._loadInitialState}
                                  couldEdit={true}/>
                        {this.state.reviews.map(item => (
                            <ReviewCard key={item.id}
                                        name={item.author_name ? item.author_name.default : ""}
                                        authorId={item.author_id}
                                        source={item.author_avatar ? item.author_avatar : ""}
                                        content={item.content}
                                        itemId={this.state.artId} itemType={'art'}
                                        textId={item.id} textType={'review'}
                                        isIntro={false} up={item.up} down={item.down}
                                        status={item.status}
                                        fontLoaded={fontLoadStatus}/>
                        ))}
                        <View style={{height: 300}}/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default Art;
