import React from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity, AsyncStorage, Text, Dimensions} from 'react-native';
import {OrderedSet} from 'immutable';
import ReviewCard from "../components/review-card";
import TitleBar from "../components/title-bar";
import ArtCard from "../components/art-card";
import ArtizenInfo from "../components/artizen-info";

class Artizen extends React.Component {

    constructor(props) {
        super(props);
        this._loadInitialState = this._loadInitialState.bind(this);
    }

    state = {introductions: OrderedSet(), reviews: OrderedSet(), nextReview: null};

    async _loadInitialState() {
        try {
            const {navigation} = this.props;
            let token = await AsyncStorage.getItem('token');
            let myId = await AsyncStorage.getItem('id');

            const artizenId = navigation.getParam('artizenId', 0);
            let artizenInfo = await fetch('https://apidev.auramaze.org/v1/artizen/' + artizenId, {
                method: 'GET',
                headers: token && token !== 'undefined' && token !== 'null' ? {
                    'Authorization': `Bearer ${token}`
                } : null
            });

            let introInfo = await fetch('https://apidev.auramaze.org/v1/artizen/' + artizenId + '/introduction', {
                method: 'GET',
                headers: token && token !== 'undefined' && token !== 'null' ? {
                    'Authorization': `Bearer ${token}`
                } : null
            });
            let artInfo = await fetch('https://apidev.auramaze.org/v1/artizen/' + artizenId + '/art');
            let reviewInfo = await fetch('https://apidev.auramaze.org/v1/artizen/' + artizenId + '/review', {
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
            let introInfoJson = introInfoJsonRaw.data;
            let reviewInfoJson = reviewInfoJsonRaw.data;
            let fontLoadStatus = this.props.screenProps.fontLoaded;

            artInfoJson.map((item, key) => {
                (item.type === "artist") && this.setState(previousState => (
                    {
                        isArtist: true,
                        artworks: item.data.map((artItem, artKey) => {
                            return (
                                <TouchableOpacity
                                    key={artKey}
                                    onPress={() => this.props.navigation.push('Art', {
                                        artId: artItem.id,
                                        titleName: artItem.title.default,
                                    })}>
                                    <ArtCard
                                        artName={artItem.title.default}
                                        artistName={artizenInfoJson.name.default}
                                        source={artItem.image && artItem.image.default ? artItem.image.default.url : ""}
                                        compYear={artItem.completionYear ? artItem.completionYear : ""}
                                        id={artItem.id}
                                        fontLoaded={fontLoadStatus}/>
                                </TouchableOpacity>
                            )
                        })
                    }
                ));
                (item.type === "museum") && this.setState(previousState => (
                    {
                        isMuseum: true,
                        collections: item.data.map((museumItem, museumKey) => {
                            return (
                                <TouchableOpacity
                                    key={museumKey}
                                    onPress={() => this.props.navigation.push('Art', {
                                        artId: museumItem.id,
                                        titleName: museumItem.title.default,
                                    })}>
                                    <ArtCard
                                        artName={museumItem.title.default}
                                        artistName={artizenInfoJson.name.default}
                                        source={museumItem.image && museumItem.image.default ? museumItem.image.default.url : ""}
                                        compYear={museumItem.completionYear ? museumItem.completionYear : ""}
                                        id={museumItem.id}
                                        fontLoaded={fontLoadStatus}/>
                                </TouchableOpacity>
                            )
                        })
                    }
                ));
                (item.type === "critic") && this.setState({
                    isCritic: true,
                    related: item.data.map((criticItem, criticKey) => {
                        return (
                            <TouchableOpacity
                                key={criticKey}
                                onPress={() => this.props.navigation.push('Art', {
                                    artId: criticItem.id,
                                    titleName: criticItem.title.default,
                                })}>
                                <ArtCard
                                    artName={criticItem.title.default}
                                    artistName={artizenInfoJson.name.default}
                                    source={criticItem.image && criticItem.image.default ? criticItem.image.default.url : ""}
                                    compYear={criticItem.completionYear ? criticItem.completionYear : ""}
                                    id={criticItem.id}
                                    fontLoaded={fontLoadStatus}/>
                            </TouchableOpacity>
                        )
                    })
                });
                (item.type === "exhibition") && this.setState({
                    isExhibition: true,
                    exhibits: item.data.map((exhibitItem, exhibitKey) => {
                        return (
                            <TouchableOpacity
                                key={exhibitKey}
                                onPress={() => this.props.navigation.push('Art', {
                                    artId: exhibitItem.id,
                                    titleName: exhibitItem.title.default,
                                })}>
                                <ArtCard
                                    artName={exhibitItem.title.default}
                                    artistName={artizenInfoJson.name.default}
                                    source={exhibitItem.image && exhibitItem.image.default ? exhibitItem.image.default.url : ""}
                                    compYear={exhibitItem.completionYear ? exhibitItem.completionYear : ""}
                                    id={exhibitItem.id}
                                    fontLoaded={fontLoadStatus}/>
                            </TouchableOpacity>
                        )
                    })
                });
                (item.type === "genre") && this.setState({
                    isGenre: true,
                    related: item.data.map((genreItem, genreKey) => {
                        return (
                            <TouchableOpacity
                                key={genreKey}
                                onPress={() => this.props.navigation.push('Art', {
                                    artId: genreItem.id,
                                    titleName: genreItem.title.default,
                                })}>
                                <ArtCard
                                    artName={genreItem.title.default}
                                    artistName={artizenInfoJson.name.default}
                                    source={genreItem.image && genreItem.image.default ? genreItem.image.default.url : ""}
                                    compYear={genreItem.completionYear ? genreItem.completionYear : ""}
                                    id={genreItem.id}
                                    fontLoaded={fontLoadStatus}/>
                            </TouchableOpacity>
                        )
                    })
                });
                (item.type === "style") && this.setState({
                    isStyle: true,
                    related: item.data.map((styleItem, styleKey) => {
                        return (
                            <TouchableOpacity
                                key={styleKey}
                                onPress={() => this.props.navigation.push('Art', {
                                    artId: styleItem.id,
                                    titleName: styleItem.title.default,
                                })}>
                                <ArtCard
                                    artName={styleItem.title.default}
                                    artistName={artizenInfoJson.name.default}
                                    source={styleItem.image && styleItem.image.default ? styleItem.image.default.url : ""}
                                    compYear={styleItem.completionYear ? styleItem.completionYear : ""}
                                    id={styleItem.id}
                                    fontLoaded={fontLoadStatus}/>
                            </TouchableOpacity>
                        )
                    })
                });
            });

            this.setState(previousState => (
                {
                    artizenId: artizenId,
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
                    introductions: OrderedSet(introInfoJson),
                    reviews: OrderedSet(reviewInfoJson),
                    nextReview: reviewInfoJsonRaw.next
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
                        {this.state.isArtist ? this.state.artworks : null}

                        {this.state.isMuseum ? <TitleBar titleText={"Collections"} fontLoaded={fontLoadStatus}/> : null}
                        {this.state.isMuseum ? this.state.collections : null}

                        {this.state.isExhibition ?
                            <TitleBar titleText={"Exhibits"} fontLoaded={fontLoadStatus}/> : null}
                        {this.state.isExhibition ? this.state.exhibits : null}

                        {this.state.isCritic ?
                            <TitleBar titleText={"Related Arts"} fontLoaded={fontLoadStatus}/> : null}
                        {this.state.isCritic ? this.state.related : null}

                        {this.state.isGenre ? <TitleBar titleText={"Related Arts"} fontLoaded={fontLoadStatus}/> :
                            <View/>}
                        {this.state.isGenre ? this.state.related : null}

                        {this.state.isStyle ? <TitleBar titleText={"Related Arts"} fontLoaded={fontLoadStatus}/> :
                            <View/>}
                        {this.state.isStyle ? this.state.related : null}

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
                            onPress={() => {
                                alert("aha")
                            }}>
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
