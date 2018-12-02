import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    Text, TouchableOpacity, AsyncStorage, FlatList
} from 'react-native';
import AutoHeightImage from "react-native-auto-height-image";
import logoIcon from "../assets/auramaze-logo.png";
import config from "../config";
import {OrderedSet} from "../utils";
import ActivityCard from "../components/activity-card";

const DismissKeyboard = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

class UserIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageIsSign: true,
            id: this.props.id,
            token: this.props.token,
            avatar: null,
            timeline: new OrderedSet(),
            next: null
        };
        this.onEndReachedCalledDuringMomentum = true;
        this.loadTimeline = this.loadTimeline.bind(this);
        this.loadMoreTimelineHandler = this.loadMoreTimelineHandler.bind(this);
    }

    componentDidMount() {
        fetch(`${config.API_ENDPOINT}/artizen/${this.state.id}`, {
            method: 'GET',
            headers: this.state.token && this.state.token !== 'undefined' && this.state.token !== 'null' ? {
                'Authorization': `Bearer ${this.state.token}`
            } : null
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Get user info fail.');
            }
        }).then((responseJson) => {
                this.setState({avatar: responseJson.avatar});
            }
        ).catch(function (error) {
            alert('There has been a problem with your fetch operation: ' + error.message);
        });
        this.loadTimeline().done();
    };

    async loadTimeline() {
        try {
            const token = await AsyncStorage.getItem('token', null);
            const id = await AsyncStorage.getItem('id', null);

            if (token && token !== 'undefined' && token !== 'null') {
                const timelineInfo = await fetch(`${config.API_ENDPOINT}/artizen/${id}/activity`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                });
                const timelineInfoJson = await timelineInfo.json();
                console.log(timelineInfoJson);
                this.setState({timeline: new OrderedSet(timelineInfoJson.data), next: timelineInfoJson.next});
            } else {
                this.setState({timeline: new OrderedSet(), next: null});
            }
        } catch (error) {
            console.log(error);
        }
    }

    async loadMoreTimelineHandler() {
        if (!this.onEndReachedCalledDuringMomentum && this.state.next) {
            const token = await AsyncStorage.getItem('token', null);
            const response = await fetch(this.state.next, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
            });
            const responseJsonRaw = await response.json();
            this.setState(previousState => ({
                timeline: previousState.timeline.union(responseJsonRaw.data),
                next: responseJsonRaw.next,
            }));
            this.onEndReachedCalledDuringMomentum = true;
        }
    }

    render() {

        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1, flexDirection: 'column',
                alignItems: 'center'
            },
            signupText: {
                color: '#666666',
                textAlign: 'center',
                paddingHorizontal: 10,
                fontSize: 15
            },
            signupScreenButton: {
                width: Dimensions.get('window').width * 2 / 3,
                marginRight: 40,
                marginLeft: 40,
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: 'white',
                borderColor: '#666666',
                borderRadius: 5
            },
            buttonGeneral: {
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('window').width - 40,
                height: 45,
                marginVertical: 10,
                borderWidth: 1
            },
            buttonAuramaze: {
                backgroundColor: '#666666',
                borderColor: '#666666'
            },
            textGeneral: {
                textAlign: 'center',
                paddingHorizontal: 10,
                fontSize: 15
            },
            textWhite: {color: 'white'},
        });

        let logOut = async () => {
            try {
                await AsyncStorage.setItem('isAuthorized', 'false')
                    .then(this.props.screenProps.toLogOut);
            } catch (error) {
                alert(error)
            }
        };

        return (
            <DismissKeyboard>
                <View>
                    <FlatList data={[
                        <View style={styles.mainStruct}>
                            <AutoHeightImage width={Dimensions.get('window').width * 2 / 7}
                                             source={this.state.avatar ? {uri: this.state.avatar} : logoIcon}
                                             style={{
                                                 marginTop: Dimensions.get('window').width * 80 / 375,
                                                 marginBottom: 30,
                                                 marginHorizontal: 'auto'
                                             }}/>
                            <TouchableOpacity
                                style={[styles.buttonGeneral, styles.buttonAuramaze]}
                                onPress={() => this.props.navigation.navigate('UserSettings', {
                                    logOut: logOut
                                })}>
                                underlayColor='#fff'>
                                <Text style={[styles.textGeneral, styles.textWhite]}>User Settings</Text>
                            </TouchableOpacity>
                        </View>,
                        ...this.state.timeline.map(item => (
                            item.art_id ?
                                <ActivityCard
                                    key={item.id}
                                    fontLoaded={this.props.fontLoaded}
                                    authorId={item.author_id}
                                    source={item.author_avatar}
                                    artId={item.art_id}
                                    artSource={item.art_image && item.art_image.default.url}
                                    artName={item.art_name && item.art_name.default}
                                    name={item.author_name && item.author_name.default}
                                    content={item.content}
                                    up={item.up}
                                    down={item.down}
                                    status={item.status}
                                    created={item.created}
                                    itemType="art"
                                    textType="review"
                                    itemId={item.art_id}
                                    textId={item.id}/> :
                                <ActivityCard
                                    key={item.id}
                                    fontLoaded={this.props.fontLoaded}
                                    authorId={item.author_id}
                                    source={item.author_avatar}
                                    artizenId={item.artizen_id}
                                    artizenSource={item.artizen_avatar}
                                    artizenName={item.artizen_name && item.artizen_name.default}
                                    name={item.author_name && item.author_name.default}
                                    content={item.content}
                                    up={item.up}
                                    down={item.down}
                                    status={item.status}
                                    created={item.created}
                                    itemType="artizen"
                                    textType="review"
                                    itemId={item.artizen_id}
                                    textId={item.id}/>))]}
                              renderItem={({item}) => item}
                              onRefresh={this.refreshTimelineHandler}
                              refreshing={this.state.refreshing}
                              onEndReached={this.loadMoreTimelineHandler}
                              onMomentumScrollBegin={() => {
                                  this.onEndReachedCalledDuringMomentum = false;
                              }}
                              keyExtractor={(item, index) => index.toString()}/>
                </View>
            </DismissKeyboard>
        );
    }
}

export default UserIndex;
