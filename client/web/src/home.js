import React, {Component} from 'react';
import Slides from './slides';
import Pitch from './pitch';
import Footer from './footer';
import './home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight
        });
    }

    render() {
        return (
            <div>
                <Slides/>
                <Pitch windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>
                <Footer windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>
            </div>
        );
    }
}

export default Home;
