import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {Constants} from 'expo';
import ArtCard from "../components/art-card";

class TimeLine extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {term: '', searchArt: '', searchArtizen: ''};

    // fetchImage(id){
    //     return fetch('https://apidev.auramaze.org/v1/art/' + id)
    //         .then((response) => response.json())
    //         .then((responseJson) => {
    //             return responseJson.image.default.url;
    //         })
    //         .catch((error) => {
    //             alert(error);
    //         });
    // }

    searchAuraMaze(url) {
        return fetch('https://apidev.auramaze.org/v1/search?q=' + url)
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState(previousState => (
                    {
                        searchArt: responseJson.art.map((item, key) => {
                            return (
                                <ArtCard key={key}
                                         artName={item.title.default}
                                         artistName={item.artist ? item.artist.default : ""}
                                         source={"https://s3.us-east-2.amazonaws.com/auramaze-test/images/william-turner/1840/238862.jpg"}
                                         compYear={item.completionYear ? item.completionYear : ""}
                                         id={item.id}
                                         fontLoaded={this.props.screenProps.fontLoaded}/>
                            );
                        })
                    }
                ));
            })
            .catch((error) => {
                alert(error);
            });
    }

    // async searchAuraMaze(url) {
    //     try {
    //         let response = await fetch('https://apidev.auramaze.org/v1/search?q=' + url);
    //         let responseJson = await response.json();
    //         alert(response.json());
    //         this.state.searchArt = responseJson.art.map((item, key) => {
    //             return (
    //                 <ArtCard key={key}
    //                          artName={item.title.default}
    //                          artistName={item.artist.default}
    //                          source={'https://s3.us-east-2.amazonaws.com/auramaze-test/images/william-turner/1840/238862.jpg'}
    //                          compYear={item.completionYear}
    //                          id={item.id}
    //                          fontLoaded={this.props.screenProps.fontLoaded}/>
    //             );
    //         });
    //     } catch (error) {
    //         alert(error);
    //     }
    // }

    onEnd = () => {
        this.searchAuraMaze(this.state.term);
    };

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

        return (
            <View style={styles.mainStruct}>
                <SearchBar
                    containerStyle={{backgroundColor: '#fff'}}
                    inputContainerStyle={{backgroundColor: '#eeeeee'}}
                    platform="ios"
                    value={this.state.term}
                    onChangeText={(term) => (
                        this.setState(previousState => (
                            {term: term}
                        )))}
                    onClear={() => (
                        this.setState(previousState => (
                            {searchArt: '', term: ''}
                        )))}
                    onSubmitEditing={this.onEnd}
                    cancelButtonTitle="Cancel"
                    onCancel={() => (
                        this.setState(previousState => (
                            {term: ''}
                        )))}
                    placeholder='Search'/>
                <ScrollView>
                    {this.state.searchArt}
                </ScrollView>
            </View>

        );
    }
}


export default TimeLine;
