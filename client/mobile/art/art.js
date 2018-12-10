import React from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, Text} from 'react-native';
import {OrderedSet} from 'immutable';
import ReviewCard from "../components/review-card";
import ArtInfo from "../components/art-info";
import TitleBar from "../components/title-bar";
import ArtizenCard from "../components/artizen-card";
import config from "../config.json";
import {withAuth} from "../App";
import {checkResponseStatus} from "../utils";

class Art extends React.Component {

    constructor(props) {
        super(props);
        this.state = {artId: 0, introductions: OrderedSet(), reviews: OrderedSet(), nextReview: null};
        this._loadInitialState = this._loadInitialState.bind(this);
        this.loadMoreReviewHandler = this.loadMoreReviewHandler.bind(this);
    }

    async componentDidMount() {
        this._loadInitialState().done();
    }

    async _loadInitialState() {
        try {
            const {navigation} = this.props;
            const {token} = this.props.auth;
            const artId = navigation.getParam('artId', 0);
            let artInfo = await fetch(`${config.API_ENDPOINT}/art/${artId}`, {
                method: 'GET',
                headers: token ? {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                } : null
            });

            let introInfo = await fetch(`${config.API_ENDPOINT}/art/${artId}/introduction`, {
                method: 'GET',
                headers: token ? {
                    'Authorization': `Bearer ${token}`
                } : null
            });
            let artizenInfo = await fetch(`${config.API_ENDPOINT}/art/${artId}/artizen`, {
                method: 'GET',
                headers: token ? {
                    'Authorization': `Bearer ${token}`
                } : null
            });
            let reviewInfo = await fetch(`${config.API_ENDPOINT}/art/${artId}/review`, {
                method: 'GET',
                headers: token ? {
                    'Authorization': `Bearer ${token}`
                } : null
            });

            if (!await checkResponseStatus([artizenInfo, introInfo, artInfo, reviewInfo], this.props.auth.removeAuth)) {
                return;
            }

            let artInfoJson = await artInfo.json();
            let artizenInfoJson = await artizenInfo.json();
            let introInfoJsonRaw = await introInfo.json();
            let reviewInfoJsonRaw = await reviewInfo.json();
            let fontLoadStatus = this.props.screenProps.fontLoaded;

            artizenInfoJson.map((item) => {
                (item.type === "artist") && this.setState({
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
                });
                (item.type === "museum") && this.setState({
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
                });
                (item.type === "genre") && this.setState({
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
                });
                (item.type === "style") && this.setState({
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
                });
            });

            this.setState({
                artId: artId,
                art: <ArtInfo fontLoaded={fontLoadStatus}
                              id={artInfoJson.id}
                              image={artInfoJson.image}
                              isFollowing={artInfoJson.following ? artInfoJson.following : 0}
                              title={artInfoJson.title.default}/>,
                introductions: OrderedSet(introInfoJsonRaw.data),
                reviews: OrderedSet(reviewInfoJsonRaw.data),
                nextReview: reviewInfoJsonRaw.next
            });
        } catch (error) {
            alert(error);
        }
    }

    async loadMoreReviewHandler() {
        try {
            let reviewInfo = await fetch(this.state.nextReview);
            let reviewInfoJsonRaw = await reviewInfo.json();
            let reviewInfoJson = reviewInfoJsonRaw.data;
            this.setState(previousState => ({
                reviews: previousState.reviews.union(OrderedSet(reviewInfoJson)),
                nextReview: reviewInfoJsonRaw.next
            }));
        } catch (error) {
            alert(error);
        }
    }

    render() {

        let fontLoadStatus = this.props.screenProps.fontLoaded;

        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1, flexDirection: 'column',
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
                                        language={item.language}
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
                                        language={item.language}
                                        itemId={this.state.artId} itemType={'art'}
                                        textId={item.id} textType={'review'}
                                        isIntro={false} up={item.up} down={item.down}
                                        status={item.status}
                                        fontLoaded={fontLoadStatus}/>
                        ))}
                        <TouchableOpacity
                            onPress={this.loadMoreReviewHandler}>
                            {this.state.nextReview ?
                                <View style={styles.nextButton}>
                                    <Text style={[styles.textStyle, styles.textNextStyle]}>
                                        Load More
                                    </Text>
                                </View> : null}
                        </TouchableOpacity>
                        <View style={{height: 300}}/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default withAuth(Art);
