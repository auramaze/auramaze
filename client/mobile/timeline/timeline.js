import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {Constants} from 'expo';
import ArtCard from "../components/art-card";
import ReviewCard from "../components/review-card";

class TimeLine extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {term: ''};

    onEnd = () => {
        alert(this.state.term);
    };

    render() {

        let fontLoadStatus = this.props.screenProps.fontLoaded;

        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1,
                alignItems: 'center',
                paddingTop: Constants.statusBarHeight,
            },
            mainContext: {
                margin: 20,
                flex: 1, flexDirection: 'column',
            },
            headerText: {
                fontSize: 20,
                color: '#666666',
                fontFamily: fontLoadStatus ? ('century-gothic-regular') : 'Cochin',
            },
            bottomLine: {
                borderBottomColor: '#666666',
                borderBottomWidth: 1,
                padding: 5,
            }
        });

        return (
            <View style={styles.mainStruct}>
                <SearchBar
                    containerStyle={{backgroundColor: '#fff'}}
                    inputContainerStyle={{backgroundColor: '#eeeeee'}}
                    platform="ios"
                    value={this.state.term}
                    onChangeText={term => this.setState({term})}
                    onEndEditing={this.onEnd}
                    cancelButtonTitle="Cancel"
                    placeholder='Search'/>
                <ArtCard artName={"The Slave Ship"}
                         artistName={"William Turner"}
                         source={'https://s3.us-east-2.amazonaws.com/auramaze-test/images/william-turner/1840/238862.jpg'}
                         compYear={1840}
                         fontLoaded={fontLoadStatus}/>
            </View>
        );
    }
}


export default TimeLine;
