import React from 'react';
import {Text, View, TouchableOpacity, Image, Dimensions} from 'react-native';
import {Camera, Permissions} from 'expo';

class CameraScreen extends React.Component {

    constructor(props) {
        super(props);
        this.takePicture = this.takePicture.bind(this);
    }

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back
    };

    async componentDidMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});
    }

    handleMountError = ({message}) => console.error(message);

    takePicture = () => {
        if (this.camera) {
            this.camera.takePictureAsync({base64: true, quality: 0.01})
                .then((photo) => {
                    // alert(photo.base64.length);
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
                            alert(JSON.stringify(response));
                            Promise.reject(response.json());
                            throw new Error('Create account fail.');
                        }
                    }).then((responseJson) => {
                            alert(JSON.stringify(responseJson));
                            let resultArt = responseJson.art;
                            if (resultArt.length === 1) {
                                this.props.navigation.navigate('Art', {
                                    artId: resultArt[0].id,
                                    titleName: resultArt[0].title.default,
                                });
                            }
                        }
                    ).catch(function (error) {
                        alert('There has been a problem with your fetch operation: ' + error.message);
                    });


                    // let str = photo.base64;
                    // alert("Size of sample is: " + str.length);
                    // let compressed = LZString.compress(str);
                    // alert("Size of compressed sample is: " + compressed.length);
                    // str = LZString.decompress(compressed);
                    // alert("Sample is: " + str.length);
                    this.setState(previousState => (
                        {
                            scannedImage: photo.base64
                        }
                    ));
                });
        }
    };

    onPictureSaved = async photo => {
        alert(photo.scannedImage);
    };

    render() {
        const {hasCameraPermission} = this.state;
        if (hasCameraPermission === null) {
            return <View/>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{flex: 1}}>
                    {this.state.scannedImage ?
                        <Image style={{flex: 1, width: Dimensions.get('window').width}}
                               source={{url: 'data:image/jpg;base64,' + this.state.scannedImage}}/> :
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
                                    backgroundColor: 'transparent',
                                    flexDirection: 'row',
                                }}>

                                <View style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    bottom: 60,
                                }}>
                                    <TouchableOpacity
                                        onPress={this.takePicture}
                                        style={{alignSelf: 'center'}}
                                    >
                                        <Text
                                            style={{fontSize: 18, marginBottom: 10, color: 'white'}}>
                                            {' '}Take{' '}
                                        </Text>

                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Camera>}

                </View>
            );
        }
    }
}

export default CameraScreen;