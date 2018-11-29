import React from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, AsyncStorage, Text, Dimensions} from 'react-native';
import {OrderedSet} from 'immutable';
import ReviewCard from "../components/review-card";
import TitleBar from "../components/title-bar";
import ArtCard from "../components/art-card";
import ArtizenInfo from "../components/artizen-info";
import config from "../config.json";

class Artizen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {introductions: OrderedSet(), reviews: OrderedSet(), nextReview: null};
        this._loadInitialState = this._loadInitialState.bind(this);
        this._fetchInfo = this._fetchInfo.bind(this);
        this.loadMoreReviewHandler = this.loadMoreReviewHandler.bind(this);
        this.loadMoreCollectionHandler = this.loadMoreCollectionHandler.bind(this);
        this.loadMoreArtworkHandler = this.loadMoreArtworkHandler.bind(this);
        this.loadMoreExhibitionHandler = this.loadMoreExhibitionHandler.bind(this);
        this.loadMoreRelatedHandler = this.loadMoreRelatedHandler.bind(this);
    }

    componentDidMount() {
        this._loadInitialState().done();
    }

    async _loadInitialState() {
        try {
            const {navigation} = this.props;
            let token = await AsyncStorage.getItem('token', null);
            let myId = await AsyncStorage.getItem('id', null);

            const artizenId = navigation.getParam('artizenId', 0);
            let artizenInfo = await fetch(`${config.API_ENDPOINT}/artizen/${artizenId}`, {
                method: 'GET',
                headers: token && token !== 'undefined' && token !== 'null' ? {
                    'Authorization': `Bearer ${token}`
                } : null
            });

            let introInfo = await fetch(`${config.API_ENDPOINT}/artizen/${artizenId}/introduction`, {
                method: 'GET',
                headers: token && token !== 'undefined' && token !== 'null' ? {
                    'Authorization': `Bearer ${token}`
                } : null
            });
            let artInfo = await fetch(`${config.API_ENDPOINT}/artizen/${artizenId}/art`);
            let reviewInfo = await fetch(`${config.API_ENDPOINT}/artizen/${artizenId}/review`, {
                method: 'GET',
                headers: token && token !== 'undefined' && token !== 'null' ? {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                } : null
            });
            let artizenInfoJson = await artizenInfo.json();
            let artInfoJson = await artInfo.json();
            let introInfoJsonRaw = await introInfo.json();
            let reviewInfoJsonRaw = await reviewInfo.json();
            let fontLoadStatus = this.props.screenProps.fontLoaded;

            artInfoJson.map((item) => {
                (item.type === "artist") && this.setState({
                    isArtist: true,
                    nextArtwork: item.next,
                    artworks: OrderedSet(item.data)
                });
                (item.type === "museum") && this.setState({
                    isMuseum: true,
                    nextCollection: item.next,
                    collections: OrderedSet(item.data)
                });
                (item.type === "critic") && this.setState({
                    isCritic: true,
                    nextRelated: item.next,
                    related: OrderedSet(item.data)
                });
                (item.type === "exhibition") && this.setState({
                    isExhibition: true,
                    nextExhibition: item.next,
                    exhibits: OrderedSet(item.data)
                });
                (item.type === "genre") && this.setState({
                    isGenre: true,
                    nextRelated: item.next,
                    related: OrderedSet(item.data)
                });
                (item.type === "style") && this.setState({
                    isStyle: true,
                    nextRelated: item.next,
                    related: OrderedSet(item.data)
                });
            });

            this.setState({
                artizenId: artizenId,
                artizenName: artizenInfoJson.name.default,
                artizen: <ArtizenInfo fontLoaded={fontLoadStatus}
                                      url={artizenInfoJson.avatar} title={artizenInfoJson.name.default}
                                      id={artizenInfoJson.id}
                                      myId={myId}
                                      isFollowing={artizenInfoJson.following ? artizenInfoJson.following : 0}
                                      isArtist={this.state.isArtist}
                                      isMuseum={this.state.isMuseum}
                                      isExhibition={this.state.isExhibition}
                                      isStyle={this.state.isStyle}
                                      isGenre={this.state.isGenre}
                                      isCritic={this.state.isCritic}/>,
                introductions: OrderedSet(introInfoJsonRaw.data),
                reviews: OrderedSet(reviewInfoJsonRaw.data),
                nextReview: reviewInfoJsonRaw.next
            });
        } catch (error) {
            alert(error);
        }
    }

    async loadMoreArtworkHandler() {
        try {
            let token = await AsyncStorage.getItem('token', null);
            let artworkInfo = await fetch(this.state.nextArtwork, {
                method: 'GET',
                headers: token && token !== 'undefined' && token !== 'null' ? {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                } : null
            });
            let artworkInfoJsonRaw = await artworkInfo.json();
            this.setState(previousState => ({
                artworks: previousState.artworks.union(OrderedSet(artworkInfoJsonRaw[0].data)),
                nextArtwork: artworkInfoJsonRaw[0].next
            }));
        } catch (error) {
            alert(error);
        }
    }


    _fetchInfo = (url, token) => fetch(url, {
        method: 'GET',
        headers: token && token !== 'undefined' && token !== 'null' ? {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            "Content-Type": "application/json"
        } : null
    });

    async loadMoreCollectionHandler() {
        try {
            let token = await AsyncStorage.getItem('token', null);
            let collectionInfo = await this._fetchInfo(this.state.nextCollection, token);
            let collectionInfoJsonRaw = await collectionInfo.json();
            this.setState(previousState => ({
                collections: previousState.collections.union(OrderedSet(collectionInfoJsonRaw[0].data)),
                nextCollection: collectionInfoJsonRaw[0].next
            }));
        } catch (error) {
            alert(error);
        }
    }

    async loadMoreExhibitionHandler() {
        try {
            let token = await AsyncStorage.getItem('token', null);
            let exhibitionInfo = await this._fetchInfo(this.state.nextExhibition, token);
            let exhibitionInfoJsonRaw = await exhibitionInfo.json();
            this.setState(previousState => ({
                exhibits: previousState.exhibits.union(OrderedSet(exhibitionInfoJsonRaw[0].data)),
                nextExhibition: exhibitionInfoJsonRaw[0].next
            }));
        } catch (error) {
            alert(error);
        }
    }

    async loadMoreRelatedHandler() {
        try {
            let token = await AsyncStorage.getItem('token', null);
            let relatedInfo = await this._fetchInfo(this.state.nextRelated, token);
            let relatedInfoJsonRaw = await relatedInfo.json();
            this.setState(previousState => ({
                related: previousState.related.union(OrderedSet(relatedInfoJsonRaw[0].data)),
                nextRelated: relatedInfoJsonRaw[0].next
            }));
        } catch (error) {
            alert(error);
        }
    }

    async loadMoreReviewHandler() {
        try {
            let token = await AsyncStorage.getItem('token', null);
            let reviewInfo = await this._fetchInfo(this.state.nextReview, token);
            let reviewInfoJsonRaw = await reviewInfo.json();
            this.setState(previousState => ({
                reviews: previousState.reviews.union(OrderedSet(reviewInfoJsonRaw.data)),
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
                marginHorizontal: 20,
                marginBottom: 20,
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
            nextButton: {
                marginTop: 20,
                borderWidth: 2,
                borderColor: '#666666',
                borderRadius: 20,
                backgroundColor: 'white',
                width: Dimensions.get('window').width * 2 / 3,
                marginHorizontal: 40
            },
            textNextStyle: {
                fontSize: 20, marginVertical: 5, marginHorizontal: 17,
                color: '#666666',
                fontFamily: this.props.screenProps.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                textAlign: 'center'
            }
        });

        return (
            <View style={styles.mainStruct}>
                <ScrollView>
                    <View style={{height: 20}}/>
                    {this.state.artizen}
                    <View style={styles.mainContext}>

                        <TitleBar titleText={"Introduction"} fontLoaded={fontLoadStatus}/>
                        {this.state.introductions.map((item) => (
                            <ReviewCard key={item.id}
                                        name={item.author_name ? item.author_name.default : ""}
                                        authorId={item.author_id}
                                        source={item.author_avatar ? item.author_avatar : ""}
                                        content={item.content}
                                        itemId={this.state.artizenId} itemType={'artizen'}
                                        textId={item.id} textType={'introduction'}
                                        isIntro={true} up={item.up} down={item.down}
                                        status={item.status}
                                        fontLoaded={fontLoadStatus}/>
                        ))}


                        {this.state.isArtist ? <TitleBar titleText={"Artworks"} fontLoaded={fontLoadStatus}/> : null}
                        {this.state.isArtist ? this.state.artworks.map((item) => {
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => this.props.navigation.push('Art', {
                                        artId: item.id,
                                        titleName: item.title.default,
                                    })}>
                                    <ArtCard
                                        artName={item.title.default}
                                        artistName={this.state.artizenName}
                                        source={item.image && item.image.default ? item.image.default.url : ""}
                                        compYear={item.completionYear ? item.completionYear : ""}
                                        id={item.id}
                                        fontLoaded={fontLoadStatus}/>
                                </TouchableOpacity>
                            )
                        }) : null}
                        <TouchableOpacity
                            onPress={this.loadMoreArtworkHandler}>
                            {this.state.nextArtwork ?
                                <View style={styles.nextButton}>
                                    <Text style={[styles.textStyle, styles.textNextStyle]}>
                                        Load More
                                    </Text>
                                </View> : null}
                        </TouchableOpacity>


                        {this.state.isMuseum ? <TitleBar titleText={"Collections"} fontLoaded={fontLoadStatus}/> : null}
                        {this.state.isMuseum ? this.state.collections.map((item) => {
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => this.props.navigation.push('Art', {
                                        artId: item.id,
                                        titleName: item.title.default,
                                    })}>
                                    <ArtCard
                                        artName={item.title.default}
                                        artistName={this.state.artizenName}
                                        source={item.image && item.image.default ? item.image.default.url : ""}
                                        compYear={item.completionYear ? item.completionYear : ""}
                                        id={item.id}
                                        fontLoaded={fontLoadStatus}/>
                                </TouchableOpacity>
                            )
                        }) : null}
                        <TouchableOpacity
                            onPress={this.loadMoreCollectionHandler}>
                            {this.state.nextCollection ?
                                <View style={styles.nextButton}>
                                    <Text style={[styles.textStyle, styles.textNextStyle]}>
                                        Load More
                                    </Text>
                                </View> : null}
                        </TouchableOpacity>


                        {this.state.isExhibition ?
                            <TitleBar titleText={"Exhibits"} fontLoaded={fontLoadStatus}/> : null}
                        {this.state.isExhibition ? this.state.exhibits.map((item) => {
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => this.props.navigation.push('Art', {
                                        artId: item.id,
                                        titleName: item.title.default,
                                    })}>
                                    <ArtCard
                                        artName={item.title.default}
                                        artistName={this.state.artizenName}
                                        source={item.image && item.image.default ? item.image.default.url : ""}
                                        compYear={item.completionYear ? item.completionYear : ""}
                                        id={item.id}
                                        fontLoaded={fontLoadStatus}/>
                                </TouchableOpacity>
                            )
                        }) : null}
                        <TouchableOpacity
                            onPress={this.loadMoreExhibitionHandler}>
                            {this.state.nextExhibition ?
                                <View style={styles.nextButton}>
                                    <Text style={[styles.textStyle, styles.textNextStyle]}>
                                        Load More
                                    </Text>
                                </View> : null}
                        </TouchableOpacity>


                        {this.state.isCritic ?
                            <TitleBar titleText={"Related Arts"} fontLoaded={fontLoadStatus}/> : null}
                        {this.state.isCritic ? this.state.related.map((item) => {
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => this.props.navigation.push('Art', {
                                        artId: item.id,
                                        titleName: item.title.default,
                                    })}>
                                    <ArtCard
                                        artName={item.title.default}
                                        artistName={this.state.artizenName}
                                        source={item.image && item.image.default ? item.image.default.url : ""}
                                        compYear={item.completionYear ? item.completionYear : ""}
                                        id={item.id}
                                        fontLoaded={fontLoadStatus}/>
                                </TouchableOpacity>
                            )
                        }) : null}


                        {this.state.isGenre ? <TitleBar titleText={"Related Arts"} fontLoaded={fontLoadStatus}/> :
                            <View/>}
                        {this.state.isGenre ? this.state.related.map((item) => {
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => this.props.navigation.push('Art', {
                                        artId: item.id,
                                        titleName: item.title.default,
                                    })}>
                                    <ArtCard
                                        artName={item.title.default}
                                        artistName={this.state.artizenName}
                                        source={item.image && item.image.default ? item.image.default.url : ""}
                                        compYear={item.completionYear ? item.completionYear : ""}
                                        id={item.id}
                                        fontLoaded={fontLoadStatus}/>
                                </TouchableOpacity>
                            )
                        }) : null}


                        {this.state.isStyle ? <TitleBar titleText={"Related Arts"} fontLoaded={fontLoadStatus}/> :
                            <View/>}
                        {this.state.isStyle ? this.state.related.map((item) => {
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => this.props.navigation.push('Art', {
                                        artId: item.id,
                                        titleName: item.title.default,
                                    })}>
                                    <ArtCard
                                        artName={item.title.default}
                                        artistName={this.state.artizenName}
                                        source={item.image && item.image.default ? item.image.default.url : ""}
                                        compYear={item.completionYear ? item.completionYear : ""}
                                        id={item.id}
                                        fontLoaded={fontLoadStatus}/>
                                </TouchableOpacity>
                            )
                        }) : null}


                        <TouchableOpacity
                            onPress={this.loadMoreRelatedHandler}>
                            {this.state.nextRelated ?
                                <View style={styles.nextButton}>
                                    <Text style={[styles.textStyle, styles.textNextStyle]}>
                                        Load More
                                    </Text>
                                </View> : null}
                        </TouchableOpacity>


                        <View style={{height: 30}}/>
                        <TitleBar titleText={"Reviews"}
                                  fontLoaded={fontLoadStatus}
                                  itemType={"artizen"}
                                  textType={"review"}
                                  itemId={this.state.artizenId}
                                  reloadFunc={this._loadInitialState}
                                  couldEdit={true}/>
                        {this.state.reviews.map((item) => (
                            <ReviewCard key={item.id}
                                        name={item.author_name ? item.author_name.default : ""}
                                        authorId={item.author_id}
                                        source={item.author_avatar ? item.author_avatar : ""}
                                        content={item.content}
                                        itemId={this.state.artizenId} itemType={'artizen'}
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

export default Artizen;
