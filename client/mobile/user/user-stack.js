import React from 'react';
import {createStackNavigator} from "react-navigation";
import Art from "../art/art";
import Artizen from "../artizen/artizen";
import User from "./user";
import UserSettings from "./user-settings";
import UserIndex from "./user-index";
import FollowingArtizen from "./following-artizen";

const UserStack = createStackNavigator(
    {
        User: {
            screen: User,
            navigationOptions: {
                header: null
            }
        },
        Art: {screen: Art},
        Artizen: {screen: Artizen},
        UserIndex: {screen: UserIndex},
        UserSettings: {screen: UserSettings},
        FollowingArtizen: {screen: FollowingArtizen},
    },
    {
        initialRouteName: 'User',
        cardStyle: {
            backgroundColor: 'white'
        },
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#fff',
                borderBottomWidth: 0,
                shadowColor: 'black',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 5,
            },
            headerTintColor: '#666666',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);

export default UserStack;
