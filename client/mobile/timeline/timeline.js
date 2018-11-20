import React from 'react';
import {StyleSheet, View, ScrollView, AsyncStorage} from 'react-native';
import {Constants} from 'expo';
import {VoteContext} from '../App';
import TopSearchBar from "../components/top-search-bar";
import SearchPage from "../components/search-page";
import ActivityCard from "../components/activity-card"


class TimeLine extends React.Component {

    constructor(props) {
        super(props);
        this.state = {searchResult: {hasSearched: false}, timeline: 'undefined'};
        this.updateSearchStatus = this.updateSearchStatus.bind(this);
    }

    componentDidMount() {
        // console.log('componentDidMount');
        // fetch('https://apidev.auramaze.org/v1/timeline', {
        //     method: 'GET',
        //     headers: {
        //         'Accept': 'application/json',
        //         "Content-Type": "application/json",
        //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAwMDAxLCJleHAiOjE1NDc0MzgzMjEsImlhdCI6MTU0MjI1NDMyMX0.7th4ihcbPQovSOwe23R-NWs5QuuN1LTesI_Xuzi-H7o'
        //     },
        // }).then(function (response) {
        //     if (response.ok) {
        //         return response.json();
        //     } else {
        //         Promise.reject(response.json());
        //         throw new Error('Get timeline fail.');
        //
        //     }
        // }).then((responseJson) => {
        //         this.setState(previousState => ({
        //             timeline: responseJson
        //         }));
        //     }
        // ).catch(function (error) {
        //     alert('There has been a problem with your fetch operation: ' + error.message);
        // });
        this._loadInitialState().done();
    }

    async _loadInitialState() {
        try {
            let token = await AsyncStorage.getItem('token');
            const {vote, updateVote} = this.props;

            let timeline = token && token !== 'undefined' && token !== 'null' ?
                await fetch('https://apidev.auramaze.org/v1/timeline', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                }) : null;

            if (!timeline) {
                this.setState(previousState => ({
                    timeline: 'undefined'
                }));
            } else {
                let timelineJson = await timeline.json();
                const newVote = timelineJson.reduce((acc, cur) => {
                    acc[cur.id] = (({up, down, status}) => ({up, down, status}))(cur);
                    return acc;
                }, {});
                // console.log('update');
                updateVote(Object.assign(vote, newVote));

                this.setState(previousState => ({
                    timeline: timelineJson
                }));
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

    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log(JSON.stringify(nextProps.vote) !== JSON.stringify(this.props.vote));
    //     return JSON.stringify(nextProps.vote) !== JSON.stringify(this.props.vote);
    // }

    render() {

        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1,
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
                    this.state.timeline !== 'undefined' ?
                        <ScrollView keyboardDismissMode='on-drag'>
                            {this.state.timeline.map((activity, key) =>
                                activity.art_id ?
                                    <ActivityCard
                                        key={key}
                                        fontLoaded={this.props.screenProps.fontLoaded}
                                        source={activity.author_avatar}
                                        artSource={activity.art_image && activity.art_image.default.url}
                                        artName={activity.art_name && activity.art_name.default}
                                        name={activity.author_name && activity.author_name.default}
                                        isIntro={false}
                                        text={activity.content.blocks.map(block => block.text).join('\n')}
                                        itemType="art"
                                        textType="review" itemId={activity.art_id} textId={activity.id}/> :
                                    <ActivityCard
                                        key={key}
                                        fontLoaded={this.props.screenProps.fontLoaded}
                                        source={activity.author_avatar}
                                        artizenSource={activity.artizen_avatar}
                                        artizenName={activity.artizen_name && activity.artizen_name.default}
                                        name={activity.author_name && activity.author_name.default}
                                        isIntro={false}
                                        text={activity.content.blocks.map(block => block.text).join('\n')}
                                        itemType="artizen"
                                        textType="review" itemId={activity.artizen_id} textId={activity.id}/>)}
                        </ScrollView> : null
                }

            </View>
        );
    }
}

class TimeLineWrapper extends React.Component {
    componentDidMount() {
        console.log('componentDidMount');
    }
    render() {
        return (
            <VoteContext.Consumer>
                {({vote, updateVote}) =>
                    <TimeLine {...this.props} vote={vote} updateVote={updateVote}/>
                }
            </VoteContext.Consumer>
        );
    }
}
export default TimeLineWrapper;
