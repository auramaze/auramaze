import React from 'react';
import {
    Text, View, TouchableOpacity, Image, Dimensions, Animated,
    Easing, Platform, StyleSheet
} from 'react-native';
import {Camera, Permissions, ImageManipulator, Location, Constants} from 'expo';
import camera_button from '../assets/icons/camera-button.png';
import loading from "../assets/auramaze-logo-white.png";
import AutoHeightImage from "react-native-auto-height-image";
import config from "../config.json";
import logoIcon from "../assets/auramaze-logo.png";
import plusIcon from "../assets/icons/plus-solid.png";
import cameraIcon from "../assets/icons/camera.png";

class CameraScreen extends React.Component {

    constructor(props) {
        super(props);
        this.takePicture = this.takePicture.bind(this);
        this.spinValue = new Animated.Value(0);
    }

    state = {
        type: Camera.Constants.Type.back,
        windowHeight: Dimensions.get('window').height,
        windowWidth: Dimensions.get('window').width,
        hasPermission: false,
        hasAskedPermission: false
    };

    async componentDidMount() {
        const {status} = await Permissions.getAsync(Permissions.CAMERA);
        if (status === 'granted') {
            this.setState({hasPermission: true, askedPermission: true});
        }
        this.spin();
    }

    async askPermission() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);

        if (status === 'granted') {
            this.setState({hasPermission: true, askedPermission: true});
        } else {
            this.setState({hasPermission: false, askedPermission: true});
        }
    }

    handleMountError = ({message}) => console.error(message);

    takePicture = async () => {
        if (this.camera) {

            this.setState({imageProcessing: true});

            this.camera.takePictureAsync({quality: 0.01, skipProcessing: true})
                .then(async (photo) => {

                    const manipResult = await ImageManipulator.manipulate(
                        photo.uri,
                        [{resize: {width: 800, height: 600}}],
                        {base64: true}
                    );

                    let dataJson = {'image': manipResult.base64};
                    fetch(`${config.API_ENDPOINT}/search?index=art`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(dataJson)
                    }).then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            this.setState({imageProcessing: false});
                            alert(JSON.stringify(response));
                            Promise.reject(response.json());
                            throw new Error('Search image fail.');
                        }
                    }).then((responseJson) => {
                            this.setState({imageProcessing: false});
                            let resultArt = responseJson.data;
                            if (resultArt.length >= 1) {
                                this.props.navigation.navigate('Art', {
                                    artId: resultArt[0].id,
                                    titleName: resultArt[0].title.default,
                                });
                            } else {
                                alert("No image found");
                            }
                        }
                    ).catch((error) => {
                        this.setState({imageProcessing: false});
                        alert('There has been a problem with your fetch operation: ' + error.message);
                    });
                });
        }
    };

    spin() {
        this.spinValue.setValue(0);
        Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(() => this.spin())
    }

    render() {
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        const styles = StyleSheet.create({
            buttonGeneral: {
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('window').width - 40,
                height: 45,
                marginVertical: 10,
                borderWidth: 1
            },
            buttonAuraMaze: {
                backgroundColor: '#666666',
                borderColor: '#666666',
                marginBottom: 40
            },
            textGeneral: {
                textAlign: 'center',
                paddingHorizontal: 10,
                fontSize: 15
            },
            textWhite: {color: 'white'},
            infoText: {
                fontSize: 15,
                paddingHorizontal: 20,
                color: '#666666',
                textAlign: 'center',
                marginVertical: 25,
            },
            headerText: {
                fontSize: 30,
                paddingHorizontal: 20,
                color: 'black',
                textAlign: 'center'
            }
        });

        if (!this.state.hasPermission) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 83}}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: 200,
                            verticalAlign: 'center'
                        }}>
                        <AutoHeightImage source={logoIcon} width={100}
                                         style={{tintColor: '#666666', marginLeft: 40}}/>
                        <AutoHeightImage source={plusIcon} width={20}
                                         style={{tintColor: '#666666', marginHorizontal: 20}}/>
                        <AutoHeightImage source={cameraIcon} width={90}
                                         style={{tintColor: 'tomato', marginRight: 40}}/>
                    </View>
                    <Text style={styles.headerText}>
                        Welcome to AuraMaze Camera!
                    </Text>
                    <Text style={styles.infoText}>
                        Let AuraMaze access your camera to identify an artwork!
                    </Text>
                    {this.state.askedPermission ?
                        <TouchableOpacity
                            style={[styles.buttonGeneral, styles.buttonAuraMaze]}
                            onPress={async () => {
                                await this.askPermission();
                            }}
                            underlayColor='#fff'>
                            <Text style={[styles.textGeneral, styles.textWhite]}>
                                Enable in Settings and reload
                            </Text>
                        </TouchableOpacity> :
                        <TouchableOpacity
                            style={[styles.buttonGeneral, styles.buttonAuraMaze]}
                            onPress={async () => {
                                await this.askPermission();
                            }}
                            underlayColor='#fff'>
                            <Text style={[styles.textGeneral, styles.textWhite]}>Enable Access</Text>
                        </TouchableOpacity>}
                </View>
            );
        } else {
            return (
                <View style={{flex: 1}}>
                    <Camera
                        style={{
                            width: Platform.OS === 'ios' ? this.state.windowWidth : this.state.windowHeight * 3 / 4,
                            height: this.state.windowHeight
                        }}
                        type={this.state.type}
                        onMountError={this.handleMountError}
                        pictureSize={"High"}
                        ref={ref => {
                            this.camera = ref;
                        }}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: !this.state.imageProcessing ? 'transparent' : 'black',
                                opacity: 0.8,
                                flexDirection: 'row',
                            }}>

                            {this.state.imageProcessing ? <View style={{
                                flex: 1,
                                alignItems: 'center', position: 'absolute',
                                left: 0, right: 0, top: 225,
                            }}>

                                <Animated.Image
                                    style={{
                                        tintColor: 'white', width: 80,
                                        height: 80, transform: [{rotate: spin}]
                                    }}
                                    source={loading}/>
                            </View> : null}

                            <View style={{
                                flex: 1,
                                position: 'absolute',
                                width: this.state.windowWidth,
                                height: this.state.windowHeight,
                                borderColor: 'black',
                                borderLeftWidth: this.state.windowWidth * 1 / 9,
                                borderRightWidth: this.state.windowWidth * 1 / 9,
                                borderTopWidth: this.state.windowHeight * 1 / 9,
                                borderBottomWidth: this.state.windowHeight * 0.8 / 3,
                                opacity: 0.6
                            }}/>


                        </View>
                    </Camera>

                    <View style={{
                        flex: 1,
                        alignItems: 'center', position: 'absolute',
                        left: 0, right: 0, bottom: this.state.windowHeight * 1 / 25,
                    }}>
                        <TouchableOpacity
                            onPress={this.takePicture}
                            style={{alignSelf: 'center'}}
                        >
                            <AutoHeightImage width={75} style={{tintColor: 'white'}}
                                             source={camera_button}/>
                        </TouchableOpacity>
                    </View>

                </View>
            );
        }
    }
}

export default CameraScreen;