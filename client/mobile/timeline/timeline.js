import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {Constants} from 'expo';
import ArtCard from "../components/art-card";
import TitleBar from "../components/title-bar";
import ArtizenCard from "../components/artizen-card";

class TimeLine extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {term: '', searchArt: '', searchArtizen: ''};

    async searchAuraMaze(url) {
        try {
            let response = await fetch('https://apidev.auramaze.org/v1/search?q=' + url);
            let responseJson = await response.json();
            let returnArtizen = responseJson.artizen.length >= 1;
            let returnArt = responseJson.art.length >=1;
            this.setState(previousState => (
                {
                    haveArtizen: returnArtizen,
                    searchArtizen: responseJson.artizen.map((item, key) => {
                        return (
                            <ArtizenCard key={key}
                                         name={item.name.default ? item.name.default : ""}
                                         source={item.avatar ? item.avatar : ""}
                                         id={item.id}
                                         fontLoaded={this.props.screenProps.fontLoaded}/>
                        );
                    }),
                    haveArt: returnArt,
                    searchArt: responseJson.art.map((item, key) => {
                        return (
                            <ArtCard key={key}
                                     artName={item.title.default}
                                     artistName={item.artist ? item.artist.default : ""}
                                     source={item.image && item.image.default ? item.image.default.url : ""}
                                     compYear={item.completionYear ? item.completionYear : ""}
                                     id={item.id}
                                     fontLoaded={this.props.screenProps.fontLoaded}/>
                        );
                    })
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
                flex: 1,
                alignItems: 'center',
                paddingTop: Constants.statusBarHeight,
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
            }
        });

        let onClear = () => {
            this.setState(previousState => (
                {term: '', searchArt: '', searchArtizen: '', haveArtizen: false, haveArt: false}
            ));
            this.search.focus();
        };

        let onCancel = () => {
            this.setState(previousState => (
                {term: ''}
            ));
        };

        let onEnd = () => {
            if (this.state.term === "") {
                this.search.clear();
                return
            }
            this.searchAuraMaze(this.state.term);
        };

        return (
            <View style={styles.mainStruct}>
                <SearchBar
                    ref={search => this.search = search}
                    containerStyle={{backgroundColor: '#fff'}}
                    inputContainerStyle={{backgroundColor: '#eeeeee'}}
                    platform="ios"
                    placeholder='Search'
                    cancelButtonTitle="Cancel"
                    value={this.state.term}
                    onChangeText={(term) => (
                        this.setState(previousState => (
                            {term: term}
                        )))}
                    onClear={onClear}
                    onSubmitEditing={onEnd}
                    onCancel={onCancel}/>
                <ScrollView>
                    {this.state.haveArtizen ?
                        <TitleBar titleText={"Artizen"} fontLoaded={this.props.screenProps.fontLoaded}/> : ""}
                    {this.state.searchArtizen}
                    {this.state.haveArtizen ? <View style={{height: 20}}/> : ""}
                    {this.state.haveArt ?
                        <TitleBar titleText={"Art"} fontLoaded={this.props.screenProps.fontLoaded}/> : ""}
                    {this.state.searchArt}
                </ScrollView>
            </View>

        );
    }
}

export default TimeLine;
