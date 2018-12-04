import React from 'react';
import {createStackNavigator} from "react-navigation";
import Art from "../art/art";
import Artizen from "../artizen/artizen";
import Recommend from "./recommend";
import SearchPage from "../search/search-page";

const RecommendStack = createStackNavigator(
    {
        Recommend: {
            screen: Recommend,
            navigationOptions: {
                header: null
            }
        },
        Art: {screen: Art},
        Artizen: {screen: Artizen},
        SearchPage: {screen: SearchPage}
    },
    {
        initialRouteName: 'Recommend',
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

export default RecommendStack;
