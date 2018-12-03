import React from 'react';
import {createStackNavigator} from "react-navigation";
import Art from "../art/art";
import Artizen from "../artizen/artizen";
import Explore from "./explore";
import SearchPage from "../search/search-page";

const ExploreStack = createStackNavigator(
    {
        Explore: {
            screen: Explore,
            navigationOptions: {
                header: null
            }
        },
        Art: {screen: Art},
        Artizen: {screen: Artizen},
        SearchPage: {screen: SearchPage}
    },
    {
        initialRouteName: 'Explore',
        cardStyle: {
            backgroundColor: 'white'
        },
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#fff',
                borderBottomWidth: 0,
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
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

export default ExploreStack;
