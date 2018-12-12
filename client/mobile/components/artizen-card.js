import React from 'react';
import {StyleSheet, View, Text, Image, Dimensions} from 'react-native';
import {Image as CachedImage, CacheManager} from "react-native-expo-image-cache";
import {noImage} from '../utils';

class ArtizenCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {path: null};
    }

    async componentDidMount() {
        const uri = this.props.source;
        const path = uri ? await CacheManager.get(uri).getPath() : null;
        this.setState({path});
    }

    render() {
        const styles = StyleSheet.create({
            cardStyle: {
                width: Dimensions.get('window').width * 5 / 6,
                paddingVertical: 10,
                paddingHorizontal: 15,
                backgroundColor: '#ffffff',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                marginTop: this.props.topMargin, marginHorizontal: 15
            },
            cardHeader: {
                flexDirection: 'row',
                alignItems: 'center',
            },
            imageStyle: {
                width: 50,
                height: 50,
                borderRadius: 25,
                borderColor: '#666666', borderWidth: 1,
            },
            avatarHolder: {
                height: 50, width: 50,
                alignItems: 'center',
            },
            headerText: {
                fontSize: 18, width: Dimensions.get('window').width * 225 / 375,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('century-gothic-regular') : 'Cochin',
                marginHorizontal: 15
            },
            bodyText: {
                fontSize: 15,
                color: '#666666',
                fontFamily: this.props.fontLoaded ? ('segoeui') : 'Cochin',
                marginHorizontal: 15, marginTop: 10
            }
        });

        return (
            <View style={styles.cardStyle}>
                <View style={styles.cardHeader}>
                    <View style={styles.avatarHolder}>
                        <CachedImage style={styles.imageStyle} uri={this.state.path || noImage}/>
                    </View>
                    <Text style={styles.headerText}>{this.props.name}</Text>
                </View>
                {this.props.showLoc ?
                    <View style={{borderTopColor: '#666666', borderTopWidth: 1, marginTop: 5}}>
                        <Text style={styles.bodyText}>
                            {this.props.showLoc.address} ({Math.floor(this.props.showLoc.distance / 1000)} km from here)
                        </Text>
                    </View> : null}

            </View>
        )
    }

}

export default ArtizenCard;
