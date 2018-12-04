import React from 'react';
import {StyleSheet, View, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import TitleBar from "../components/title-bar";
import Art from "../art/art";
import {OrderedSet} from '../utils';
import ArtizenCard from "../components/artizen-card";
import ArtCard from "../components/art-card";
import MessageCard from "../components/message-card";
import {withNavigation} from "react-navigation";


class SearchPage extends React.Component {

    constructor(props) {
        super(props);
        const {navigation} = this.props;
        this.state = {
            haveArtizen: navigation.getParam('haveArtizen', false),
            haveArt: navigation.getParam('haveArt', false),
            searchArtizen: navigation.getParam('searchArtizen', new OrderedSet([])),
            searchArt: navigation.getParam('searchArt', new OrderedSet([])),
            nextArt: navigation.getParam('nextArt', null),
            nextArtizen: navigation.getParam('nextArtizen', null),
        };
        this.onArtEndReachedCalledDuringMomentum = true;
        this.loadMoreArtHandler = this.loadMoreArtHandler.bind(this);
        this.loadMoreArtizenHandler = this.loadMoreArtizenHandler.bind(this);
    }

    async loadMoreArtHandler() {
        if (!this.onArtEndReachedCalledDuringMomentum && this.state.nextArt) {
            const responseArt = await fetch(this.state.nextArt);
            const responseArtJsonRaw = await responseArt.json();
            this.setState(previousState => ({
                searchArt: previousState.searchArt.union(responseArtJsonRaw.data),
                nextArt: responseArtJsonRaw.next,
            }));
            this.onArtEndReachedCalledDuringMomentum = true;
        }
    }

    async loadMoreArtizenHandler() {
        if (!this.onArtizenEndReachedCalledDuringMomentum && this.state.nextArtizen) {
            const responseArtizen = await fetch(this.state.nextArtizen);
            const responseArtizenJsonRaw = await responseArtizen.json();
            this.setState(previousState => ({
                searchArtizen: previousState.searchArtizen.union(responseArtizenJsonRaw.data),
                nextArtizen: responseArtizenJsonRaw.next,
            }));
            this.onArtizenEndReachedCalledDuringMomentum = true;
        }
    }

    render() {

        const styles = StyleSheet.create({
            mainContext: {
                paddingHorizontal: 15, justifyContent: 'center',
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

        if (this.state.searchArtizen.size) {
            dataToRender.push(
                <View style={{marginHorizontal: 5}}>
                    <TitleBar titleText={"Artizen"} fontLoaded={fontLoadStatus}/>
                </View>);
            dataToRender.push(<FlatList style={{paddingVertical: 20}}
                                        data={this.state.searchArtizen.toArray()}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({item}) => (
                                            <TouchableOpacity key={item.id}
                                                              onPress={() => this.props.navigation.navigate('Artizen', {
                                                                  artizenId: item.id,
                                                                  titleName: item.name.default,
                                                              })}>
                                                <ArtizenCard name={item.name.default ? item.name.default : ""}
                                                             source={item.avatar ? item.avatar : null}
                                                             id={item.id}
                                                             topMargin={0}
                                                             fontLoaded={fontLoadStatus}/>
                                            </TouchableOpacity>)}
                                        onEndReached={this.loadMoreArtizenHandler}
                                        onMomentumScrollBegin={() => {
                                            this.onArtizenEndReachedCalledDuringMomentum = false;
                                        }}
                                        keyExtractor={(item, index) => index.toString()}/>);
        }
        if (this.state.searchArt.size) {
            dataToRender.push(
                <View style={{marginHorizontal: 5}}>
                    <TitleBar titleText={"Art"} fontLoaded={fontLoadStatus}/>
                </View>);
            dataToRender = dataToRender.concat(this.state.searchArt.map(item => (
                <TouchableOpacity key={item.id}
                                  onPress={() => this.props.navigation.navigate('Art', {
                                      artId: item.id,
                                      titleName: item.title.default,
                                  })}>
                    <ArtCard artName={item.title.default}
                             source={item.image && item.image.default ? item.image.default.url : null}
                             compYear={item.completionYear ? item.completionYear : ""}
                             id={item.id}
                             fontLoaded={fontLoadStatus}
                    />
                </TouchableOpacity>
            )));
        }

        return (
            <View style={styles.mainContext}>
                {dataToRender.length ? <FlatList data={dataToRender}
                                                 renderItem={({item}) => (item)}
                                                 onEndReached={this.loadMoreArtHandler}
                                                 onMomentumScrollBegin={() => {
                                                     this.onArtEndReachedCalledDuringMomentum = false;
                                                 }}
                                                 keyExtractor={(item, index) => index.toString()}/> :
                    <MessageCard fontLoaded={fontLoadStatus}
                                 text={'No search result.\nPlease try other keywords.'}
                                 onPress={() => {
                                     this.props.navigation.pop();
                                 }}/>}
            </View>
        );
    }
}

export default withNavigation(SearchPage);
