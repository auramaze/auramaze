import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Text} from 'react-native';
import ReviewCard from "../components/review-card";
import ArtInfo from "../components/art-info";
import TitleBar from "../components/title-bar";
import ArtizenCard from "../components/artizen-card";

class Art extends React.Component {

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
            const artId = navigation.getParam('artId', 0);
            let artInfo = await fetch('https://apidev.auramaze.org/v1/art/' + artId);
            let introInfo = await fetch('https://apidev.auramaze.org/v1/art/' + artId + '/introduction');
            let artizenInfo = await fetch('https://apidev.auramaze.org/v1/art/' + artId + '/artizen');
            let reviewInfo = await fetch('https://apidev.auramaze.org/v1/art/' + artId + '/review');
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
                    {/*<TopBar/>*/}
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
                        <ReviewCard name={"Ray"}
                                    isIntro={false} up={12} down={12}
                                    source={'https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/caravaggio.jpg'}
                                    text={`\n\t说来惭愧，真正意识到梵高的伟大是在自己得了精神疾病以后。虽然以前去过好几个收录了梵高作品的博物馆，却没有感受到强烈的冲击。直到后来得了严重的抑郁症，每天需要吃药才有感触。有一个夏天的晚上吃完某种安定情绪的药物后产生了幻觉，当我看到窗外稀疏的星星时，星星就像《星空》中的一样旋转跳跃起来，甚至涌向我。第一时间我想到了梵高，感动得留下了眼泪，由于吃药我已经很久没有哭了。这种感觉不是悲伤也不是孤独，而是理解。世界上形形色色的人当中总有一些孤独的灵魂，而孤独的灵魂也可以有强烈的共鸣，虽然我们不是一个时代的人。\n`}
                                    fontLoaded={fontLoadStatus}/>

                    </View>
                </ScrollView>
            </View>
        );
    }
}


export default Art;
