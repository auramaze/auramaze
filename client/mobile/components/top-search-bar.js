import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Text, FlatList} from 'react-native';
import {SearchBar} from 'react-native-elements';
import ArtCard from "../components/art-card";
import ArtizenCard from "../components/artizen-card";
import Art from "../art/art";
import config from "../config.json";


class TopSearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {searchArtizen: []};
    }

    async searchAuraMaze(searchItem) {
        try {
            let responseArt = await fetch(`${config.API_ENDPOINT}/search?index=art&q=${encodeURIComponent(searchItem)}`);
            let responseArtizen = await fetch(`${config.API_ENDPOINT}/search?index=artizen&q=${encodeURIComponent(searchItem)}`);
            let responseArtJson = await responseArt.json();
            let responseArtizenJson = await responseArtizen.json();
            let returnArt = responseArtJson.data.length >= 1;
            let returnArtizen = responseArtizenJson.data.length >= 1;
            let artizenArray = [];
            responseArtizenJson.data.map((item, key) => {
                artizenArray.push(
                    <TouchableOpacity key={key}
                                      onPress={() => this.props.navigation.navigate('Artizen', {
                                          artizenId: item.id,
                                          titleName: item.name.default,
                                      })}>
                        <ArtizenCard name={item.name.default ? item.name.default : ""}
                                     source={item.avatar ? item.avatar : null}
                                     id={item.id}
                                     topMargin={0}
                                     fontLoaded={this.props.fontLoaded}/>
                    </TouchableOpacity>)
            });

            let artizenArrays = [], size = 2;
            while (artizenArray.length > 0)
                artizenArrays.push(artizenArray.splice(0, size));

            this.setState({
                nextArt: responseArtJson.next,
                nextArtizen: responseArtizenJson.next,
                haveArt: returnArt,
                haveArtizen: returnArtizen,
                searchArtizen: artizenArrays,
                searchArt: responseArtJson.data.map((item, key) => {
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
                                source={item.image && item.image.default ? item.image.default.url : null}
                                compYear={item.completionYear ? item.completionYear : ""}
                                id={item.id}
                                fontLoaded={this.props.fontLoaded}
                            />
                        </TouchableOpacity>
                    );
                })
            });
            this.props.updateSearchStatus({
                hasSearched: true,
                searchArt: this.state.searchArt, haveArt: this.state.haveArt,
                searchArtizen: this.state.searchArtizen, haveArtizen: this.state.haveArtizen,
                nextArt: this.state.nextArt, nextArtizen: this.state.nextArtizen,
            })
        } catch (error) {
            alert(error);
        }
    }

    render() {

        let onClear = () => {
            this.setState({term: '', searchArt: '', searchArtizen: [], haveArtizen: false, haveArt: false});
            this.props.updateSearchStatus({
                hasSearched: false
            });
            this.search.focus();
        };

        let onCancel = () => {
            this.setState({term: ''});
        };

        let onEnd = () => {
            if (this.state.term === "") {
                this.search.clear();
                return
            }
            this.searchAuraMaze(this.state.term).done();
        };


        return (
            <SearchBar
                ref={search => this.search = search}
                containerStyle={{backgroundColor: '#fff'}}
                inputContainerStyle={{backgroundColor: '#eeeeee'}}
                platform="ios"
                placeholder='Search'
                cancelButtonTitle="Cancel"
                value={this.state.term}
                onChangeText={(term) => (this.setState({term: term}))}
                onClear={onClear}
                onSubmitEditing={onEnd}
                onCancel={onCancel}/>
        );
    }
}

export default TopSearchBar;
