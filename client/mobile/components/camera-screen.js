import React from 'react';
import {Text, View, TouchableOpacity, Image, Dimensions} from 'react-native';
import {Camera, Permissions} from 'expo';

class CameraScreen extends React.Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back
    };

    async componentDidMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});
    }

    handleMountError = ({message}) => console.error(message);

    // takePicture = () => {
    //     if (this.camera) {
    //         this.camera.takePictureAsync({onPictureSaved: this.onPictureSaved});
    //     }
    // };

    takePicture = () => {
        if (this.camera) {
            this.camera.takePictureAsync({base64: true})
                .then((photo) => {
                    // alert(photo.base64.slice(0,100));
                    this.setState(previousState => (
                        {
                            url: photo.base64
                        }
                    ));
                });
        }
    };

    onPictureSaved = async photo => {
        alert(photo.url);
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
                    {this.state.url ?
                        <Image style={{flex: 1, width: Dimensions.get('window').width}} source={{url: 'data:image/jpg;base64,' + this.state.url}}/> :
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