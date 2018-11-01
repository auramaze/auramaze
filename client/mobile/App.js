import React from 'react';
import Art from "./art/art"
import {Font} from 'expo';

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
        return (
            <Art fontLoaded={this.state.fontLoaded}/>
        );
    }
}
