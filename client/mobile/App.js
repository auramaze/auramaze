import React from 'react';
import Art from "./art/art"
import {Font} from 'expo';
import {createBottomTabNavigator, TabBarBottom, TabNavigator} from "react-navigation";
import {Image, StyleSheet, Text, View} from "react-native";
import compass from './icons/compass.png';
import journal from './icons/journal.png';
import camera from './icons/camera.png';
import camera_left from './icons/camera-left.png';
import camera_right from './icons/camera-right.png';
import recommendation from './icons/recommand.png';
import lines from './icons/lines.png';


class TimeLineScreen extends React.Component {
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>TimeLine Screen</Text>
            </View>
        );
    }
}

class RecommendScreen extends React.Component {
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>Recommend Screen</Text>
            </View>
        );
    }
}

class CameraScreen extends React.Component {
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>Camera Screen</Text>
            </View>
        );
    }
}

class SettingScreen extends React.Component {
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>Setting Screen</Text>
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

        const MyNavi = createBottomTabNavigator(
            {
                TimeLine: {screen: TimeLineScreen},
                Artventure: {screen: Art},
                CameraLeft: {screen: CameraScreen},
                CameraRight: {screen: CameraScreen},
                Recommend: {screen: RecommendScreen},
                Settings: {screen: SettingScreen},
            },
            {
                navigationOptions: ({navigation}) => ({
                    tabBarIcon: ({focused, tintColor}) => {
                        const styles = StyleSheet.create({
                            imageStyle: {
                                width: 30,
                                height: 30,
                                tintColor: tintColor,
                                margin: 10
                            },
                            cameraStyle: {
                                tintColor: '#fff',
                            },
                            cameraLeftStyle: {
                                marginRight: -25,
                            },
                            cameraHolder: {
                                flex: 1, flexDirection: 'row',
                                width: 65,
                                height: 40,
                                backgroundColor: '#909090',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginVertical: 10
                            },
                            cameraHolderLeft: {
                                borderBottomLeftRadius: 15,
                                borderTopLeftRadius: 15,
                                marginLeft: 25,
                            },
                            cameraHolderRight: {
                                width: 35,
                                borderBottomRightRadius: 15,
                                borderTopRightRadius: 15,
                                marginRight: 0,
                            }
                        });

                        const {routeName} = navigation.state;

                        if (routeName === 'CameraLeft') {
                            return <View style={[styles.cameraHolder, styles.cameraHolderLeft]}>
                                <Image source={camera}
                                       style={[styles.imageStyle, styles.cameraStyle, styles.cameraLeftStyle]}/>
                            </View>
                        } else if (routeName === 'CameraRight') {
                            return <View style={[styles.cameraHolder, styles.cameraHolderRight]}/>
                        }

                        let iconName;

                        (routeName === 'TimeLine') && (iconName = compass);
                        (routeName === 'Artventure') && (iconName = journal);
                        (routeName === 'Recommend') && (iconName = recommendation);
                        (routeName === 'Settings') && (iconName = lines);

                        return <Image source={iconName} style={styles.imageStyle}/>;
                    },
                }),
                tabBarPosition: 'bottom',
                tabBarOptions: {
                    activeTintColor: 'tomato',
                    inactiveTintColor: '#666666',
                    showLabel: false,
                    tabStyle: {
                        // borderColor: 'black',
                        // borderWidth: 1
                    },
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
