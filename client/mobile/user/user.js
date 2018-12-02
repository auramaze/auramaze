import React from 'react';
import {
    View,
    Dimensions,
    AsyncStorage
} from 'react-native';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import UserIndex from "./user-index";
import BlankUser from "./blank-user";
import {Constants} from "expo";
import FollowingArtizen from "./following-artizen";
import FollowingArt from "./following-art";

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageIsSign: true,
            hasAuthorized: false,
            id: null,
            token: null,
            index: 0,
            routes: [
                {key: 'profile', title: 'Profile'},
                {key: 'art', title: 'View Art'},
                {key: 'artizen', title: 'View Artizen'},
            ],
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('isAuthorized', null).then((value) => {
            if (value === undefined || value === 'false') {
                AsyncStorage.multiSet([
                    ['isAuthorized', 'false'],
                    ["username", 'undefined'],
                    ["token", 'undefined'],
                    ["id", 'undefined'],
                ]);
                this.setState({hasAuthorized: false});
            } else {
                AsyncStorage.multiGet(['isAuthorized', 'username', 'token', 'id']).then((data) => {
                    let token = data[2][1];
                    let id = data[3][1];
                    this.setState({hasAuthorized: true, id: id, token: token});
                });
            }
        });
    };

    render() {

        let _toLogOut = () => {
            AsyncStorage.multiSet([
                ['isAuthorized', 'false'],
                ["username", 'undefined'],
                ["token", 'undefined'],
                ["id", 'undefined'],
            ]).then(this.setState({hasAuthorized: false}));
            this.props.navigation.popToTop();
        };

        let _toLogIn = () => {
            this.setState({hasAuthorized: true});
        };

        const ProfileRoute = () => (
            <UserIndex id={this.state.id}
                       token={this.state.token}
                       screenProps={{toLogOut: _toLogOut}}
                       navigation={this.props.navigation}/>
        );

        const ArtRoute = () => (
            <FollowingArt id={this.state.id}
                          token={this.state.token}
                          fontLoaded={this.props.screenProps.fontLoaded}
                          navigation={this.props.navigation}/>
        );

        const ArtizenRoute = () => (
            <FollowingArtizen id={this.state.id}
                              token={this.state.token}
                              fontLoaded={this.props.screenProps.fontLoaded}
                              navigation={this.props.navigation}/>
        );

        if (this.state.hasAuthorized !== true) {
            return (
                <BlankUser screenProps={{toLogIn: _toLogIn}}/>
            );
        } else {
            return (
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        profile: ProfileRoute,
                        art: ArtRoute,
                        artizen: ArtizenRoute
                    })}
                    onIndexChange={index => this.setState({index})}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            indicatorStyle={{backgroundColor: 'black'}}
                            style={{backgroundColor: 'white'}}
                            labelStyle={{
                                color: '#666666',
                                textAlign: 'center',
                                fontFamily: this.props.screenProps.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                                fontSize: 15
                            }}
                            getLabelText={({route}) => route.title}
                        />
                    }
                    initialLayout={{
                        width: Dimensions.get('window').width,
                    }}
                    style={{paddingTop: Constants.statusBarHeight}}
                />
            )
        }

    }
}

export default User;
