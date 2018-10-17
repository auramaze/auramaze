import React, {Component} from 'react';
import Lottie from 'react-lottie';
import * as animationData from './data.json';
import Fade from 'react-reveal/Fade';
import Slides from './slides';
import Pitch from './pitch';
import Footer from '../components/footer';
import './home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: document.documentElement.clientWidth,
            windowHeight: window.innerHeight,
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
            windowHeight: window.innerHeight
        });
    }

    render() {
        return (
            <div className="home">
                <Slides windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>
                <Pitch windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>
                <Fade bottom>
                    <div className="lottie-container">
                        <Lottie
                            options={{
                                loop: true, autoplay: true, animationData: animationData, renderer: 'svg'
                            }}
                        />
                    </div>
                </Fade>
                <Footer windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>
            </div>
        );
    }
}

export default Home;
