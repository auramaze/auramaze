import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Text} from 'react-native';
import ReviewCard from "../components/review-card";
import ArtInfo from "../components/art-info";
import TitleBar from "../components/title-bar";
import ArtCard from "../components/art-card";
import ArtizenInfo from "../components/artizen-info";

class Artizen extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {};

    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('titleName', 'No Title'),
        };
    };

    async componentDidMount() {
        try {
            const {navigation} = this.props;
            const artizenId = navigation.getParam('artizenId', 0);
            let artizenInfo = await fetch('https://apidev.auramaze.org/v1/artizen/' + artizenId);
            let introInfo = await fetch('https://apidev.auramaze.org/v1/artizen/' + artizenId + '/introduction');
            let artInfo = await fetch('https://apidev.auramaze.org/v1/artizen/' + artizenId + '/art');
            let artizenInfoJson = await artizenInfo.json();
            let introInfoJson = await introInfo.json();
            let artInfoJson = await artInfo.json();
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
                (item.type === "critic") && this.setState(previousState => (
                    {
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
                    }
                ));
                (item.type === "exhibition") && this.setState(previousState => (
                    {
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
                    }
                ));
                (item.type === "genre") && this.setState(previousState => (
                    {
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
                    }
                ));
                (item.type === "style") && this.setState(previousState => (
                    {
                        isStyle: true,
                        related: item.data.map((styleItem, styleKey) => {
                            return (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => this.props.navigation.push('Art', {
                                        artId: styleItem.id,
                                        titleName: styleItem.title.default,
                                    })}>
                                    <ArtCard
                                        key={styleKey}
                                        artName={styleItem.title.default}
                                        artistName={artizenInfoJson.name.default}
                                        source={styleItem.image && styleItem.image.default ? styleItem.image.default.url : ""}
                                        compYear={styleItem.completionYear ? styleItem.completionYear : ""}
                                        id={styleItem.id}
                                        fontLoaded={fontLoadStatus}/>
                                </TouchableOpacity>
                            )
                        })
                    }
                ));
            });

            this.setState(previousState => (
                {
                    artizen: <ArtizenInfo fontLoaded={fontLoadStatus}
                                          url={artizenInfoJson.avatar} title={artizenInfoJson.name.default}
                                          isArtist={this.state.isArtist}
                                          isMuseum={this.state.isMuseum}
                                          isExhibition={this.state.isExhibition}
                                          isStyle={this.state.isStyle}
                                          isGenre={this.state.isGenre}
                                          isCritic={this.state.isCritic}/>,
                    introductions: introInfoJson.map((item, key) => {
                        return (

                            <ReviewCard key={key}
                                        name={item.author_name ? item.author_name.default : ""}
                                        source={item.author_avatar ? item.author_avatar : ""}
                                        text={item.content.blocks[0].text}
                                        id={item.id}
                                        isIntro={true} up={item.up} down={item.down}
                                        fontLoaded={fontLoadStatus}/>

                        );
                    }),
                }
            ));
        } catch (error) {
            alert(error);
        }
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
                    <View style={{height: 20}}/>
                    {this.state.artizen}
                    <View style={styles.mainContext}>

                        <TitleBar titleText={"Introduction"} fontLoaded={fontLoadStatus}/>
                        {this.state.introductions}

                        {this.state.isArtist ? <TitleBar titleText={"Artworks"} fontLoaded={fontLoadStatus}/> : <View/>}
                        {this.state.artworks}

                        {this.state.isMuseum ? <TitleBar titleText={"Collections"} fontLoaded={fontLoadStatus}/> :
                            <View/>}
                        {this.state.collections}

                        {this.state.isExhibition ? <TitleBar titleText={"Exhibits"} fontLoaded={fontLoadStatus}/> :
                            <View/>}
                        {this.state.exhibits}

                        {this.state.isCritic ? <TitleBar titleText={"Related Arts"} fontLoaded={fontLoadStatus}/> :
                            <View/>}
                        {this.state.related}

                        {this.state.isGenre ? <TitleBar titleText={"Related Arts"} fontLoaded={fontLoadStatus}/> :
                            <View/>}
                        {this.state.related}

                        {this.state.isStyle ? <TitleBar titleText={"Related Arts"} fontLoaded={fontLoadStatus}/> :
                            <View/>}
                        {this.state.related}

                        <View style={{height: 30}}/>

                    </View>
                </ScrollView>
            </View>
        );
    }
}


export default Artizen;
