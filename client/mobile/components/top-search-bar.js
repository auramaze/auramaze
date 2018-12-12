import React from 'react';
import {SearchBar} from 'react-native-elements';
import config from "../config.json";
import {OrderedSet} from 'immutable';


class TopSearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {searchArtizen: OrderedSet([]), searchArt: OrderedSet([])};
    }

    async searchAuraMaze(searchItem) {
        try {
            let responseArt = await fetch(`${config.API_ENDPOINT}/search?index=art&q=${encodeURIComponent(searchItem)}`);
            let responseArtizen = await fetch(`${config.API_ENDPOINT}/search?index=artizen&q=${encodeURIComponent(searchItem)}`);
            let responseArtJson = await responseArt.json();
            let responseArtizenJson = await responseArtizen.json();

            this.setState({
                nextArt: responseArtJson.next,
                nextArtizen: responseArtizenJson.next,
                searchArtizen: OrderedSet(responseArtizenJson.data),
                searchArt: OrderedSet(responseArtJson.data)
            });
            this.props.navigation.navigate('SearchPage',
                {
                    searchArt: this.state.searchArt,
                    searchArtizen: this.state.searchArtizen,
                    nextArt: this.state.nextArt,
                    nextArtizen: this.state.nextArtizen
                })
        } catch (error) {
            alert(error);
        }
    }

    render() {

        let onClear = () => {
            this.setState({
                term: '',
                searchArtizen: OrderedSet([]),
                searchArt: OrderedSet([]),
                haveArtizen: false,
                haveArt: false
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
