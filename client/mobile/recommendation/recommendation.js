import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Text, FlatList, AsyncStorage} from 'react-native';
import {Constants} from 'expo';
import TopSearchBar from "../components/top-search-bar";
import SearchPage from "../components/search-page";


class Recommendation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {searchResult: {hasSearched: false}};
        this.updateSearchStatus = this.updateSearchStatus.bind(this);
    }

    componentDidMount() {

    }

    async loadRecommend() {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token === null) {
                alert('Please log in to use this function!')
            } else {
                fetch(`https://apidev.auramaze.org/v1/recommend`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    }
                }).then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Get recommendation.');
                    }
                }).then((responseJson) => {
                    alert(responseJson);
                }).catch(function (error) {
                    this.setState(previousState => ({auramazeProcessing: false}));
                    alert('There has been a problem with your fetch operation: ' + error.message);
                });
            }
        } catch (error) {
            alert(error);
        }
    }


    updateSearchStatus = (info) => {
        this.setState(previousState => (
            {searchResult: info}
        ));
    };



    render() {

        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1, alignItems: 'center',
                paddingTop: Constants.statusBarHeight,
            }
        });


        return (
            <View style={styles.mainStruct}>

                <TopSearchBar updateSearchStatus={this.updateSearchStatus}
                              navigation={this.props.navigation}
                              fontLoaded={this.props.screenProps.fontLoaded}/>

                {this.state.searchResult.hasSearched ? <SearchPage searchResult={this.state.searchResult}
                                                      fontLoaded={this.props.screenProps.fontLoaded}/> :
                    null}

            </View>
        );
    }
}

export default Recommendation;
