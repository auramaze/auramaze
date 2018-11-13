import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Text, FlatList} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {Constants} from 'expo';
import ArtCard from "../components/art-card";
import TitleBar from "../components/title-bar";
import ArtizenCard from "../components/artizen-card";
import Art from "../art/art";


class TimeLine extends React.Component {

    constructor(props) {
        super(props);
        this.state = {searchArtizen: []};
    }

    async searchAuraMaze(url) {
        try {
            let response = await fetch('https://apidev.auramaze.org/v1/search?q=' + url);
            let responseJson = await response.json();
            let returnArtizen = responseJson.artizen.length >= 1;
            let returnArt = responseJson.art.length >= 1;
            let object_arr = [];
            responseJson.artizen.map((item, key) => {
                object_arr.push(
                    <TouchableOpacity key={key}
                                      onPress={() => this.props.navigation.navigate('Artizen', {
                                          artizenId: item.id,
                                          titleName: item.name.default,
                                      })}>
                        <ArtizenCard name={item.name.default ? item.name.default : ""}
                                     source={item.avatar ? item.avatar : ""}
                                     id={item.id}
                                     topMargin={0}
                                     fontLoaded={this.props.screenProps.fontLoaded}/>
                    </TouchableOpacity>)
            });
            this.setState(previousState => (
                {
                    haveArtizen: returnArtizen,
                    searchArtizen: object_arr,
                    haveArt: returnArt,
                    searchArt: responseJson.art.map((item, key) => {
                        return (
                            <TouchableOpacity
                                key={key}
                                onPress={() => this.props.navigation.navigate('Art', {
                                    artId: item.id,
                                    titleName: item.title.default,
                                })}>
                                <ArtCard
                                    artName={item.title.default}
                                    artistName={item.artist ? item.artist.default : ""}
                                    source={item.image && item.image.default ? item.image.default.url : ""}
                                    compYear={item.completionYear ? item.completionYear : ""}
                                    id={item.id}
                                    fontLoaded={this.props.screenProps.fontLoaded}
                                />
                            </TouchableOpacity>
                        );
                    })
                }
            ));
        } catch (error) {
            alert(error);
        }
    }


    static renderRow(item) {
        return (
            <View style={{margin: 5}}>
                <View style={{
                    width: Dimensions.get('window').width * 300 / 375,
                    marginTop: 10, marginHorizontal: 10,
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    {item[0]}
                </View>
                {item.length > 1 ?
                    <View
                        style={{
                            width: Dimensions.get('window').width * 300 / 375, height: 100,
                            marginHorizontal: 10, marginBottom: -20,
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                        {item[1]}
                    </View> : null}
            </View>
        );
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
                paddingHorizontal: 15, justifyContent: 'center',
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
            container: {
                paddingVertical: 5,
            }
        });

        let onClear = () => {
            this.setState(previousState => (
                {term: '', searchArt: '', searchArtizen: [], haveArtizen: false, haveArt: false}
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
        let arrays = [], size = 2;
        while (this.state.searchArtizen.length > 0)
            arrays.push(this.state.searchArtizen.splice(0, size));
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

                <View style={styles.mainContext}>
                    <ScrollView keyboardDismissMode='on-drag'>
                        {this.state.haveArtizen ?
                            <View style={{marginHorizontal: 5}}>
                                <TitleBar titleText={"Artizen"} fontLoaded={this.props.screenProps.fontLoaded}/>
                            </View> : null}
                        <FlatList data={arrays}
                                  horizontal={true}
                                  showsHorizontalScrollIndicator={false}
                                  renderItem={({item}) => TimeLine.renderRow(item)}
                                  keyExtractor={(item, index) => index.toString()}/>

                        {this.state.haveArtizen ? <View style={{height: 20}}/> : null}
                        {this.state.haveArt ?
                            <View style={{marginHorizontal: 5}}>
                                <TitleBar titleText={"Art"} fontLoaded={this.props.screenProps.fontLoaded}/>
                            </View> : null}
                        <View style={{flex: 1, alignItems: 'center'}}>
                            {this.state.searchArt}
                        </View>
                    </ScrollView>
                </View>


            </View>

        );
    }
}

export default TimeLine;
