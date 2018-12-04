import React from 'react';
import {Font} from 'expo';
import {createBottomTabNavigator} from "react-navigation";
import {AsyncStorage, Dimensions, Image, StyleSheet} from "react-native";
import compass from './assets/icons/compass.png';
import map from './assets/icons/map.png';
import camera from './assets/icons/camera.png';
import recommend from './assets/icons/recommand.png';
import profile from './assets/icons/profile.png';
import CameraStack from "./camera/camera-stack";
import TimeLineStack from "./timeline/timeline-stack";
import RecommendStack from "./recommend/recommend-stack";
import UserStack from "./user/user-stack";
import ExploreStack from "./explore/explore-stack";
import {parseAuth} from "./utils";

export const AuthContext = React.createContext();

export function withAuth(Component) {
    return function WrapperComponent(props) {
        return (
            <AuthContext.Consumer>
                {({id, token, createAuth, removeAuth}) => {
                    return <Component {...props} auth={{id, token, createAuth, removeAuth}}/>;
                }}
            </AuthContext.Consumer>
        );
    };
}

const lengthBasis = Dimensions.get('window').width / 375;

const MyNavi = createBottomTabNavigator(
    {
        Timeline: {screen: TimeLineStack},
        Explore: {screen: ExploreStack},
        Camera: {screen: CameraStack},
        Recommend: {screen: RecommendStack},
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
                else if (routeName === 'Recommend') iconName = recommend;
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
        initialRouteName: 'Profile'
    }
);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.createAuth = async (id, token) => {
            await AsyncStorage.multiSet([
                ['id', `${id}`],
                ['token', `${token}`],
            ]);
            this.setState({id, token});
        };

        this.removeAuth = async () => {
            await AsyncStorage.multiSet([
                ['id', 'undefined'],
                ['token', 'undefined'],
            ]);
            this.setState({id: undefined, token: undefined});
        };

        this.state = {
            fontLoaded: false,
            id: undefined,
            token: undefined,
            createAuth: this.createAuth,
            removeAuth: this.removeAuth
        };
    }

    async componentDidMount() {
        await Font.loadAsync({
            'century-gothic-regular': require('./assets/fonts/century-gothic.ttf'),
            'segoeui': require('./assets/fonts/segoeui.ttf'),
            'segoeui-bold': require('./assets/fonts/segoeuib.ttf'),
        });

        let id = parseAuth(await AsyncStorage.getItem('id'));
        id = id && parseInt(id);
        const token = parseAuth(await AsyncStorage.getItem('token'));

        this.setState({fontLoaded: true, id, token});
    }

    render() {
        const {id, token, createAuth, removeAuth} = this.state;

        return (
            <AuthContext.Provider value={{id, token, createAuth, removeAuth}}>
                <MyNavi screenProps={{fontLoaded: this.state.fontLoaded}}/>
            </AuthContext.Provider>
        );
    }
}
