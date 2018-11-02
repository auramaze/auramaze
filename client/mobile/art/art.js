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
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
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
                    <ArtInfo fontLoaded={this.props.fontLoaded}/>
                    <View style={styles.mainContext}>

                        <TitleBar titleText={"Introduction"} fontLoaded={this.props.fontLoaded}/>
                        <ReviewCard fontLoaded={this.props.fontLoaded}/>

                        <TitleBar titleText={"Artist"} fontLoaded={this.props.fontLoaded}/>
                        <ArtizenCard name={"Vincent van Gogh"}
                                     source={'https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/vincent-van-gogh.jpg'}
                                     fontLoaded={this.props.fontLoaded}/>

                        <TitleBar titleText={"Museum"} fontLoaded={this.props.fontLoaded}/>
                        <ArtizenCard name={"Museum of Modern Art"}
                                     source={'https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/artic.png'}
                                     fontLoaded={this.props.fontLoaded}/>

                        <TitleBar titleText={"Genre"} fontLoaded={this.props.fontLoaded}/>
                        <ArtizenCard name={"Cloudscapes"}
                                     source={'https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/auramaze-logo-square.png'}
                                     fontLoaded={this.props.fontLoaded}/>

                        <TitleBar titleText={"Style"} fontLoaded={this.props.fontLoaded}/>
                        <ArtizenCard name={"Post-Impressionism"}
                                     source={'https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/auramaze-logo-square.png'}
                                     fontLoaded={this.props.fontLoaded}/>
                        <View style={{height: 30}}/>
                        <TitleBar titleText={"Reviews"} fontLoaded={this.props.fontLoaded}/>
                        <ReviewCard fontLoaded={this.props.fontLoaded}/>
                        <ReviewCard fontLoaded={this.props.fontLoaded}/>
                        <ReviewCard fontLoaded={this.props.fontLoaded}/>

                    </View>
                    <View style={{height: 80}}/>
                </ScrollView>
                <BottomNav/>
            </View>
        );
    }
}


export default Art;
