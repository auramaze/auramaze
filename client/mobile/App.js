import React from 'react';
import BottomNav from "./components/bottom-nav";
import Art from "./art/art"
import { Font } from 'expo';

export default class App extends React.Component {

    state = {
        fontLoaded: false,
    };

    async componentDidMount() {
        await Font.loadAsync({
            'century-gothic-regular': require('./assets/fonts/century-gothic.ttf'),
        });

        this.setState({ fontLoaded: true });
    }

  render() {
    return (
        this.state.fontLoaded ? (
            <Art />
        ) : null
    );
  }
}
