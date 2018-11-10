import React from 'react';
import Art from "./art/art"
import {Font} from 'expo';
import { createStackNavigator, createBottomTabNavigator} from "react-navigation";
import {Dimensions, Image, StyleSheet, Text, View, Linking} from "react-native";
import compass from './icons/compass.png';
import journal from './icons/journal.png';
import camera from './icons/camera.png';
import recommendation from './icons/recommand.png';
import lines from './icons/lines.png';
import TimeLine from "./timeline/timeline";
import { Input } from 'react-native-elements';
import CameraScreen from "./components/camera-screen";
import TimeLineStack from "./components/timeline-stack";

class RecommendScreen extends React.Component {

    _handlePress = () => {
        Linking.openURL("https://dev.auramaze.org");
        this.props.onPress && this.props.onPress();
    };

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text onPress={this._handlePress}>Recommend Screen</Text>
            </View>
        );
    }
}

class SettingScreen extends React.Component {
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Input
                    placeholder='BASIC INPUT'
                />


                <Input
                    placeholder='INPUT WITH SHAKING EFFECT'
                    shake={true}
                />

                <Input
                    placeholder='INPUT WITH ERROR MESSAGE'
                    errorStyle={{ color: 'red' }}
                    errorMessage='ENTER A VALID ERROR HERE'
                />
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

        const lengthBasis = Dimensions.get('window').width/375;

        const MyNavi = createBottomTabNavigator(
            {
                TimeLine: {screen: TimeLineStack},
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
                                width: 30, height: 30, margin: 10,
                                tintColor: tintColor
                            },
                            cameraStyle: {tintColor: '#fff'},
                            cameraLeftStyle: {marginRight: -lengthBasis*25},
                            cameraHolder: {
                                flex: 1, flexDirection: 'row',
                                width: lengthBasis*65,
                                height: lengthBasis*40,
                                backgroundColor: '#909090',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginVertical: lengthBasis*10
                            },
                            cameraHolderLeft: {
                                borderBottomLeftRadius: lengthBasis*19,
                                borderTopLeftRadius: lengthBasis*19,
                                marginLeft: lengthBasis*25,
                            },
                            cameraHolderRight: {
                                width: lengthBasis*35,
                                borderBottomRightRadius: lengthBasis*19,
                                borderTopRightRadius: lengthBasis*19,
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

                        let iconName = '';
                        if (routeName === 'TimeLine') iconName = compass;
                        else if (routeName === 'Artventure') iconName = journal;
                        else if (routeName === 'Recommend') iconName = recommendation;
                        else if (routeName === 'Settings') iconName = lines;

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
