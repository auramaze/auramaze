import React from 'react';
import {createStackNavigator} from "react-navigation";
import Art from "../art/art";
import Artizen from "../artizen/artizen";
import Recommendation from "./recommendation";

const RecommendationStack = createStackNavigator(
    {
        TimeLine: {
            screen: Recommendation,
            navigationOptions: {
                header: null
            }
        },
        Art: {screen: Art},
        Artizen: {screen: Artizen},
    },
    {
        initialRouteName: 'Recommendation',
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

export default RecommendationStack;
