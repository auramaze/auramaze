import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Text, AsyncStorage} from 'react-native';
import ReviewCard from "../components/review-card";
import ArtInfo from "../components/art-info";
import TitleBar from "../components/title-bar";
import ArtizenCard from "../components/artizen-card";

class Art extends React.Component {

    constructor(props) {
        super(props);
        this._loadInitialState = this._loadInitialState.bind(this);
    }

    state = {};

    async _loadInitialState() {
        try {
            const {navigation} = this.props;

            let token = await AsyncStorage.getItem('token');
            const artId = navigation.getParam('artId', 0);
            let artInfo = await fetch('https://apidev.auramaze.org/v1/art/' + artId);
            let introInfo = token && token !== 'undefined' && token !== 'null' ?
                await fetch('https://apidev.auramaze.org/v1/art/' + artId + '/introduction', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    }
                }) : await fetch('https://apidev.auramaze.org/v1/art/' + artId + '/introduction', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    }
                });
            let artizenInfo = await fetch('https://apidev.auramaze.org/v1/art/' + artId + '/artizen');
            let reviewInfo = token && token !== 'undefined' && token !== 'null' ?
                await fetch('https://apidev.auramaze.org/v1/art/' + artId + '/review', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    }
                }) : await fetch('https://apidev.auramaze.org/v1/art/' + artId + '/review', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    }
                });
            let artInfoJson = await artInfo.json();
            let introInfoJson = await introInfo.json();
            let artizenInfoJson = await artizenInfo.json();
            let reviewInfoJson = await reviewInfo.json();
            let fontLoadStatus = this.props.screenProps.fontLoaded;
            // let returnArtizen = responseJson.artizen.length >= 1;
            // let returnArt = responseJson.art.length >= 1;

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
                }
                else if (item.type === "museum") {
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
                }
                else if (item.type === "genre") {
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
                }
                else if (item.type === "style") {
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
                    art: <ArtInfo fontLoaded={fontLoadStatus}
                                  url={artInfoJson.image.default.url} title={artInfoJson.title.default}/>,
                    introductions: introInfoJson.map((item, key) => {
                        return (

                            <ReviewCard key={key}
                                        name={item.author_name ? item.author_name.default : ""}
                                        authorId={item.author_id}
                                        source={item.author_avatar ? item.author_avatar : ""}
                                        content={item.content}
                                        itemId={artId} itemType={'art'}
                                        textId={item.id} textType={'introduction'}
                                        isIntro={true} up={item.up} down={item.down}
                                        status={item.status}
                                        fontLoaded={fontLoadStatus}/>

                        );
                    }),
                    reviews: reviewInfoJson.map((item, key) => {
                        return (
                            <ReviewCard key={key}
                                        name={item.author_name ? item.author_name.default : ""}
                                        authorId={item.author_id}
                                        source={item.author_avatar ? item.author_avatar : ""}
                                        content={item.content}
                                        itemId={artId} itemType={'art'}
                                        textId={item.id} textType={'review'}
                                        isIntro={false} up={item.up} down={item.down}
                                        status={item.status}
                                        fontLoaded={fontLoadStatus}/>
                        );
                    })
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
                        {this.state.introductions}

                        {this.state.hasArtists ? <TitleBar titleText={"Artist"} fontLoaded={fontLoadStatus}/> : <View/>}
                        {this.state.artists}

                        {this.state.hasMuseums ? <TitleBar titleText={"Museum"} fontLoaded={fontLoadStatus}/> : <View/>}
                        {this.state.museums}

                        {this.state.hasGenres ? <TitleBar titleText={"Genre"} fontLoaded={fontLoadStatus}/> : <View/>}
                        {this.state.genres}

                        {this.state.hasStyles ? <TitleBar titleText={"Style"} fontLoaded={fontLoadStatus}/> : <View/>}
                        {this.state.styles}

                        <View style={{height: 30}}/>
                        <TitleBar titleText={"Reviews"} fontLoaded={fontLoadStatus}/>
                        {this.state.reviews}

                    </View>
                </ScrollView>
            </View>
        );
    }
}


export default Art;
