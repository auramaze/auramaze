import React from 'react';
import {Font} from 'expo';
import {createBottomTabNavigator} from "react-navigation";
import {Dimensions, Image, StyleSheet, Text, View} from "react-native";
import artventure from './assets/icons/artventure.png';
import compass from './assets/icons/compass.png';
import map from './assets/icons/map.png';
import camera from './assets/icons/camera.png';
import recommendation from './assets/icons/recommand.png';
import profile from './assets/icons/profile.png';
import CameraStack from "./camera/camera-stack";
import TimeLineStack from "./timeline/timeline-stack";
import RecommendationStack from "./recommendation/recommendation-stack";
import AutoHeightImage from "react-native-auto-height-image";
import UserStack from "./user/user-stack";

class SettingScreen extends React.Component {
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <AutoHeightImage style={{marginVertical: 100}}
                                 width={100}
                                 source={artventure}/>
                <Text>Artventure page, still in constructing.</Text>
            </View>
        );
    }
}

export default class App extends React.Component {

    state = {
        fontLoaded: false,
    };

    async componentDidMount() {
        await Font.loadAsync({
            'century-gothic-regular': require('./assets/fonts/century-gothic.ttf'),
            'segoeui': require('./assets/fonts/segoeui.ttf'),
            'segoeui-bold': require('./assets/fonts/segoeuib.ttf'),
        });

        this.setState({fontLoaded: true});
    }

    render() {

        const lengthBasis = Dimensions.get('window').width / 375;

        const MyNavi = createBottomTabNavigator(
            {
                Timeline: {screen: TimeLineStack},
                Explore: {screen: SettingScreen},
                Camera: {screen: CameraStack},
                Recommend: {screen: RecommendationStack},
                Profile: {screen: UserStack},
            },
            {
                navigationOptions: ({navigation}) => ({
                    tabBarIcon: ({focused, tintColor}) => {
                        const styles = StyleSheet.create({
                            imageStyle: {
                                width: 30, height: 30, margin: 10,
                                tintColor: tintColor
                            },
                            cameraStyle: {tintColor: '#fff'},
                            cameraHolder: {
                                flex: 1, flexDirection: 'row',
                                width: lengthBasis * 65,
                                height: lengthBasis * 40,
                                backgroundColor: '#909090',
                                borderRadius: lengthBasis * 45,
                                alignItems: 'center', justifyContent: 'center',
                                marginVertical: 8 / (Dimensions.get('window').width / 375)
                            }
                        });

                        const {routeName} = navigation.state;

                        let iconName = '';
                        if (routeName === 'Timeline') iconName = compass;
                        else if (routeName === 'Explore') iconName = map;
                        else if (routeName === 'Camera') iconName = camera;
                        else if (routeName === 'Recommend') iconName = recommendation;
                        else if (routeName === 'Profile') iconName = profile;

                        return <Image source={iconName} style={styles.imageStyle}/>;
                    },
                }),
                tabBarPosition: 'bottom',
                tabBarOptions: {
                    activeTintColor: 'tomato',
                    inactiveTintColor: '#666666',
                    showLabel: true,
                    style: {
                        height: 60,
                        backgroundColor: '#ffffff',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: -2},
                        shadowOpacity: 0.2,
                        borderColor: '#fff',
                    }
                },
                animationEnabled: true,
                swipeEnabled: true,
            }
        );

        return (
            <MyNavi screenProps={{fontLoaded: this.state.fontLoaded}}/>
        );
    }
}
