import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Text, FlatList} from 'react-native';
import {Constants} from 'expo';
import TopSearchBar from "../components/top-search-bar";
import SearchPage from "../components/search-page";


class TimeLine extends React.Component {

    constructor(props) {
        super(props);
        this.state = {searchResult: {hasSearched: false}};
        this.updateSearchStatus = this.updateSearchStatus.bind(this);
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

export default TimeLine;
