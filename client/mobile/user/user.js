import React from 'react';
import {
    View,
    Dimensions,
} from 'react-native';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import UserIndex from "./user-index";
import BlankUser from "./blank-user";
import {Constants} from "expo";
import FollowingArtizen from "./following-artizen";
import FollowingArt from "./following-art";
import {withAuth} from "../App";

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIsSign: true,
            index: 0,
            routes: [
                {key: 'profile', title: 'Profile'},
                {key: 'art', title: 'View Art'},
                {key: 'artizen', title: 'View Artizen'},
            ],
        };
    }

    _renderScene = ({route}) => {
        switch (route.key) {
            case 'profile':
                return (
                    <UserIndex fontLoaded={this.props.screenProps.fontLoaded}
                               navigation={this.props.navigation}/>
                );
            case 'art':
                return (
                    <FollowingArt fontLoaded={this.props.screenProps.fontLoaded}
                                  navigation={this.props.navigation}/>
                );
            case 'artizen':
                return (
                    <FollowingArtizen fontLoaded={this.props.screenProps.fontLoaded}
                                      navigation={this.props.navigation}/>
                );
            default:
                return null;
        }
    };


    render() {
        if (!this.props.auth.id) {
            return (
                <BlankUser/>
            );
        } else {
            return (
                <TabView
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    swipeEnabled={false}
                    onIndexChange={index => this.setState({index})}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            indicatorStyle={{backgroundColor: 'black'}}
                            style={{backgroundColor: 'white'}}
                            labelStyle={{
                                color: '#666666',
                                textAlign: 'center',
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

export default withAuth(User);
