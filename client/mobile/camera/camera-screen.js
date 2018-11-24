import React from 'react';
import {
    Text, View, TouchableOpacity, Image, Dimensions, Animated,
    Easing
} from 'react-native';
import {Camera, Permissions} from 'expo';
import camera_button from '../assets/icons/camera-button.png';
import loading from "../assets/auramaze-logo-white.png";
import AutoHeightImage from "react-native-auto-height-image";

class CameraScreen extends React.Component {

    constructor(props) {
        super(props);
        this.takePicture = this.takePicture.bind(this);
        this.spinValue = new Animated.Value(0);
    }

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back
    };

    async componentDidMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});
        this.spin();
    }

    handleMountError = ({message}) => console.error(message);

    takePicture = async () => {
        // const dim = Dimensions.get('window');
        // alert('width: '+ dim.width);
        // alert('height: '+ dim.height);

        if (this.camera) {

            this.setState({imageProcessing: true});

            this.camera.takePictureAsync({base64: true, quality: 0.01, skipProcessing: true})
                .then((photo) => {
                    let dataJson = {'image': photo.base64};

                    fetch('https://apidev.auramaze.org/v1/search', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(dataJson)
                    }).then(function (response) {
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
                            // alert(JSON.stringify(responseJson));
                            let resultArt = responseJson.art;
                            if (resultArt.length >= 1) {
                                this.props.navigation.navigate('Art', {
                                    artId: resultArt[0].id,
                                    titleName: resultArt[0].title.default,
                                });
                            } else {
                                alert("No image found");
                            }
                        }
                    ).catch(function (error) {
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
        const {hasCameraPermission} = this.state;
        if (hasCameraPermission === null) {
            return <View/>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{flex: 1}}>
                    <Camera
                        style={{flex: 1}}
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
                                width: Dimensions.get('window').width,
                                height: Dimensions.get('window').height,
                                borderColor: 'black',
                                borderLeftWidth: Dimensions.get('window').width * 1 / 9,
                                borderRightWidth: Dimensions.get('window').width * 1 / 9,
                                borderTopWidth: Dimensions.get('window').height * 1 / 9,
                                borderBottomWidth: Dimensions.get('window').height * 0.8 / 3,
                                opacity: 0.6
                            }}/>

                            <View style={{
                                flex: 1,
                                alignItems: 'center', position: 'absolute',
                                left: 0, right: 0, bottom: 25,
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
                    </Camera>

                </View>
            );
        }
    }
}

export default CameraScreen;