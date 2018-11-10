import React from 'react';
import {createStackNavigator} from "react-navigation";
import {SearchBar} from 'react-native-elements';
import Art from "../art/art";
import TimeLine from "../timeline/timeline";

const TimeLineStack = createStackNavigator(
    {
        TimeLine: {
            screen: TimeLine,
            navigationOptions: {
                header: null
            }
        },
        Art: {screen: Art},
    },
    {
        initialRouteName: 'TimeLine',
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

export default TimeLineStack;
