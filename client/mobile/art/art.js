import React from 'react';
import {StyleSheet, View, Text, ScrollView, Dimensions, Image} from 'react-native';
import TopBar from "../components/top-bar";
import BottomNav from "../components/bottom-nav";
import ReviewCard from "../components/review-card";
import ArtInfo from "../components/art-info";
import TitleBar from "../components/title-bar";
import ArtizenCard from "../components/artizen-card";

class Art extends React.Component {

    constructor(props) {
        super(props);
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
                    <TopBar/>
                    <ArtInfo fontLoaded={fontLoadStatus}/>
                    <View style={styles.mainContext}>

                        <TitleBar titleText={"Introduction"} fontLoaded={fontLoadStatus}/>
                        <ReviewCard name={"AuraMaze"}
                                    source={'https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/auramaze-logo-square.png'}
                                    text={`\n\tThe Starry Night is an oil on canvas by the Dutch post-impressionist painter Vincent van Gogh.\n\tPainted in June 1889, it depicts the view from the east-facing window of his asylum room at Saint-Rémy-de-Provence, just before sunrise, with the addition of an idealized village. It has been in the permanent collection of the Museum of Modern Art in New York City since 1941, acquired through the Lillie P. Bliss Bequest. Regarded as among Van Gogh's finest works, The Starry Night is one of the most  recognized  paintings in the history of Western culture.\n`}
                                    fontLoaded={fontLoadStatus}/>

                        <TitleBar titleText={"Artist"} fontLoaded={fontLoadStatus}/>
                        <ArtizenCard name={"Vincent van Gogh"}
                                     source={'https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/vincent-van-gogh.jpg'}
                                     fontLoaded={fontLoadStatus}/>

                        <TitleBar titleText={"Museum"} fontLoaded={fontLoadStatus}/>
                        <ArtizenCard name={"Museum of Modern Art"}
                                     source={'https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/artic.png'}
                                     fontLoaded={fontLoadStatus}/>

                        <TitleBar titleText={"Genre"} fontLoaded={fontLoadStatus}/>
                        <ArtizenCard name={"Cloudscapes"}
                                     source={'https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/genre-painting.jpg'}
                                     fontLoaded={fontLoadStatus}/>

                        <TitleBar titleText={"Style"} fontLoaded={fontLoadStatus}/>
                        <ArtizenCard name={"Post-Impressionism"}
                                     source={'https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/post-impressionism.jpg'}
                                     fontLoaded={fontLoadStatus}/>
                        <View style={{height: 30}}/>
                        <TitleBar titleText={"Reviews"} fontLoaded={fontLoadStatus}/>
                        <ReviewCard name={"Ray"}
                                    source={'https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/caravaggio.jpg'}
                                    text={`\n\t说来惭愧，真正意识到梵高的伟大是在自己得了精神疾病以后。虽然以前去过好几个收录了梵高作品的博物馆，却没有感受到强烈的冲击。直到后来得了严重的抑郁症，每天需要吃药才有感触。有一个夏天的晚上吃完某种安定情绪的药物后产生了幻觉，当我看到窗外稀疏的星星时，星星就像《星空》中的一样旋转跳跃起来，甚至涌向我。第一时间我想到了梵高，感动得留下了眼泪，由于吃药我已经很久没有哭了。这种感觉不是悲伤也不是孤独，而是理解。世界上形形色色的人当中总有一些孤独的灵魂，而孤独的灵魂也可以有强烈的共鸣，虽然我们不是一个时代的人。\n`}
                                    fontLoaded={fontLoadStatus}/>

                    </View>
                </ScrollView>
                {/*<BottomNav/>*/}
            </View>
        );
    }
}


export default Art;
