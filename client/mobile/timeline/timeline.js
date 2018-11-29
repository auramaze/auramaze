import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    AsyncStorage,
    RefreshControl,
    Dimensions,
    Text,
    TouchableOpacity
} from 'react-native';
import {Constants} from 'expo';
import {OrderedSet} from 'immutable';
import TopSearchBar from "../components/top-search-bar";
import SearchPage from "../components/search-page";
import ActivityCard from "../components/activity-card";
import config from "../config.json";


class TimeLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {searchResult: {hasSearched: false}, timeline: OrderedSet(), refreshing: false, next: null};
        this.updateSearchStatus = this.updateSearchStatus.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    componentDidMount() {
        this._loadInitialState().done();
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this._loadInitialState().then(() => {
            this.setState({refreshing: false});
        });
    };

    async _loadInitialState() {
        try {
            const token = await AsyncStorage.getItem('token', null);

            if (token && token !== 'undefined' && token !== 'null') {
                const timelineInfo = await fetch(`${config.API_ENDPOINT}/timeline`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                });
                const timelineInfoJson = await timelineInfo.json();
                this.setState({timeline: OrderedSet(timelineInfoJson.data), next: timelineInfoJson.next});
            } else {
                this.setState({timeline: OrderedSet(), next: null});
            }
        } catch (error) {
            console.log(error);
        }
    }

    updateSearchStatus = (info) => {
        this.setState({searchResult: info});
    };

    render() {
        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1,
                paddingTop: Constants.statusBarHeight,
            },
            backPage: {
                backgroundColor: '#cdcdcd',
                marginBottom: 40
            }
        });

        return (
            <View style={styles.mainStruct}>

                <View style={!this.state.searchResult.hasSearched ? styles.backPage : null}>

                    <TopSearchBar updateSearchStatus={this.updateSearchStatus}
                                  navigation={this.props.navigation}
                                  fontLoaded={this.props.screenProps.fontLoaded}/>

                    {this.state.searchResult.hasSearched ? <SearchPage searchResult={this.state.searchResult}
                                                                       fontLoaded={this.props.screenProps.fontLoaded}/> :
                        <ScrollView keyboardDismissMode='on-drag'
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={this._onRefresh}
                                        />
                                    }>
                            {this.state.timeline.size ? this.state.timeline.map(activity =>
                                    activity.art_id ?
                                        <ActivityCard
                                            key={activity.id}
                                            fontLoaded={this.props.screenProps.fontLoaded}
                                            authorId={activity.author_id}
                                            source={activity.author_avatar}
                                            artId={activity.art_id}
                                            artSource={activity.art_image && activity.art_image.default.url}
                                            artName={activity.art_name && activity.art_name.default}
                                            name={activity.author_name && activity.author_name.default}
                                            content={activity.content}
                                            up={activity.up}
                                            down={activity.down}
                                            status={activity.status}
                                            created={activity.created}
                                            itemType="art"
                                            textType="review" itemId={activity.art_id} textId={activity.id}/> :
                                        <ActivityCard
                                            key={activity.id}
                                            fontLoaded={this.props.screenProps.fontLoaded}
                                            authorId={activity.author_id}
                                            source={activity.author_avatar}
                                            artizenId={activity.artizen_id}
                                            artizenSource={activity.artizen_avatar}
                                            artizenName={activity.artizen_name && activity.artizen_name.default}
                                            name={activity.author_name && activity.author_name.default}
                                            content={activity.content}
                                            up={activity.up}
                                            down={activity.down}
                                            status={activity.status}
                                            created={activity.created}
                                            itemType="artizen"
                                            textType="review" itemId={activity.artizen_id} textId={activity.id}/>)
                                : <View style={{height: Dimensions.get('window').height}}/>}
                            <View style={{height: 5}}/>
                        </ScrollView>
                    }
                </View>
            </View>
        );
    }
}

export default TimeLine;
