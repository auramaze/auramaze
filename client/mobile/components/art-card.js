import React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {Image as CachedImage, CacheManager} from "react-native-expo-image-cache";
import {getImageDefaultHeight, getImageDefaultUrl, getImageDefaultWidth, noImage} from "../utils";

class ArtCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {path: null};
    }

    async componentDidMount() {
        const uri = getImageDefaultUrl(this.props.image);
        const path = uri ? await CacheManager.get(uri).getPath() : null;
        this.setState({path});
    }

    render() {
        const styles = StyleSheet.create({
            cardStyle: {
                flexDirection: 'column',
                width: Dimensions.get('window').width * 5 / 6,
                backgroundColor: '#ffffff',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                marginHorizontal: 15, marginVertical: 20,
            },
            generalText: {
                color: '#666666', marginHorizontal: 15,
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
            },
            headerText: {
                fontSize: 20, marginTop: 10, marginBottom: 5
            },
            infoText: {
                fontSize: 15, marginBottom: 10
            },
        });


        return (
            <View style={styles.cardStyle}>
                <CachedImage style={{
                    width: Dimensions.get('window').width * 5 / 6,
                    height: Dimensions.get('window').width * 5 / 6 * getImageDefaultHeight(this.props.image) / getImageDefaultWidth(this.props.image)
                }} uri={this.state.path || noImage}/>
                <Text style={[styles.generalText, styles.headerText]}>{this.props.artName}</Text>
                {this.props.artistName ? <Text style={[styles.generalText, styles.infoText]}>
                    {this.props.artistName} {this.props.compYear ? "," + this.props.compYear : ""}
                </Text> : <View style={{height: 10}}/>}
            </View>
        )
    }
}

export default ArtCard;
