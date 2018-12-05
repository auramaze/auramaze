import React from 'react';
import {
    Text, View, TouchableOpacity, Image, Dimensions, Animated,
    Easing, Platform
} from 'react-native';
import {Camera, Permissions, ImageManipulator, Location} from 'expo';
import camera_button from '../assets/icons/camera-button.png';
import loading from "../assets/auramaze-logo-white.png";
import AutoHeightImage from "react-native-auto-height-image";
import config from "../config.json";

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
        if (!this.state.hasPermission) {
            return (<View style={{marginTop: 100}}>
                {this.state.askedPermission ?
                    <TouchableOpacity onPress={async () => {
                        await this.askPermission();
                    }}>
                        <Text>Please go to Settings to enable camera.</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity onPress={async () => {
                        await this.askPermission();
                    }}>
                        <Text>has not asked permission</Text>
                    </TouchableOpacity>}
            </View>);
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