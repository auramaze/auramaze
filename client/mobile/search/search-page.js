import React from 'react';
import {StyleSheet, View, Dimensions, FlatList} from 'react-native';
import TitleBar from "../components/title-bar";
import Art from "../art/art";
import {OrderedSet} from 'immutable';


class SearchPage extends React.Component {

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.state = {
            haveArtizen: navigation.getParam('haveArtizen', false),
            haveArt: navigation.getParam('haveArt', false),
            searchArtizen: navigation.getParam('searchArtizen', OrderedSet([])),
            searchArt: navigation.getParam('searchArt', OrderedSet([])),
            nextArt: navigation.getParam('nextArt', null),
            nextArtizen: navigation.getParam('nextArtizen', null),
        };
        SearchPage.renderRow = SearchPage.renderRow.bind(this);
        this.loadMoreArtHandler = this.loadMoreArtHandler.bind(this);
    }

    async loadMoreArtHandler() {
        alert("aha");
        try {
            let responseArt = await fetch(this.state.nextArt);
            let responseArtJsonRaw = await responseArt.json();
            this.setState(previousState => ({
                searchArt: previousState.searchArt.union(OrderedSet(responseArtJsonRaw.data)),
                nextArt: responseArtJsonRaw.next,
            }));
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

        const styles = StyleSheet.create({
            mainContext: {
                paddingHorizontal: 15, justifyContent: 'center'
            },
            headerText: {
                fontSize: 20,
                color: '#666666',
                fontFamily: this.props.fontLoaded ?
                    ('century-gothic-regular') : 'Cochin',
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

        let fontLoadStatus = this.props.screenProps.fontLoaded;

        let dataToRender = [];

        if (this.state.haveArtizen) dataToRender.push(
            <View style={{marginHorizontal: 5}}>
                <TitleBar titleText={"Artizen"} fontLoaded={fontLoadStatus}/>
            </View>);
        dataToRender.push(<FlatList data={this.state.searchArtizen.toArray()}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({item}) => SearchPage.renderRow(item)}
                                    keyExtractor={(item, index) => index.toString()}/>);
        if (this.state.haveArt) dataToRender.push(
            <View style={{marginHorizontal: 5}}>
                <TitleBar titleText={"Art"} fontLoaded={fontLoadStatus}/>
            </View>);
        dataToRender.concat(this.state.searchArt.toArray());
        alert(dataToRender.length);

        return (
            <View style={styles.mainContext}>
                <FlatList data={dataToRender}
                          renderItem={({item}) => item}
                          onEndReached={this.loadMoreArtHandler}
                          onEndThreshold={0}
                          keyExtractor={(item, index) => index.toString()}/>
            </View>
        );
    }
}

export default SearchPage;
