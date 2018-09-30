import React, {Component} from 'react';
import {VelocityComponent} from 'velocity-react';
import './Slides.css';

class Slides extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            imgSrc: 'https://s3.us-east-2.amazonaws.com/auramaze-test/slides/starry-night.jpg',
            imgWidth: 1136,
            imgHeight: 900,
            imgFixedStyle: {},
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
        this.setState({windowWidth: window.innerWidth, windowHeight: window.innerHeight});
    }

    static getImgFixedStyle(imgWidth, imgHeight, windowWidth, windowHeight) {
        if (imgWidth / imgHeight > windowWidth / windowHeight) {
            return {height: windowHeight};
        } else {
            return {width: windowWidth};
        }
    }

    static getImgStartStyle(imgWidth, imgHeight, windowWidth, windowHeight) {
        if (imgWidth / imgHeight > windowWidth / windowHeight) {
            return {marginLeft: windowWidth - imgWidth * windowHeight / imgHeight};
        } else {
            return {marginTop: windowHeight - imgHeight * windowWidth / imgWidth};
        }
    }

    static getImgEndStyle(imgWidth, imgHeight, windowWidth, windowHeight) {
        if (imgWidth / imgHeight > windowWidth / windowHeight) {
            return {marginLeft: 0};
        } else {
            return {marginTop: 0};
        }
    }

    static getImgAnimDuration(imgWidth, imgHeight, windowWidth, windowHeight) {
        const startStyle = this.getImgStartStyle(imgWidth, imgHeight, windowWidth, windowHeight);
        const distance = -startStyle[Object.keys(startStyle)[0]];
        return distance * 10;
    }

    render() {
        return (

            <div className="Slides"
                 style={{
                     height: this.state.windowHeight,
                     width: this.state.windowWidth,
                     backgroundColor: '#666666',
                     overflow: 'hidden',
                 }}>
                <VelocityComponent
                    animation={Slides.getImgEndStyle(this.state.imgWidth, this.state.imgHeight, this.state.windowWidth, this.state.windowHeight)}
                    duration={Slides.getImgAnimDuration(this.state.imgWidth, this.state.imgHeight, this.state.windowWidth, this.state.windowHeight)}
                    runOnMount
                    complete={() => {
                        alert('complete');
                    }}>
                    <img
                        src={this.state.imgSrc}
                        style={{
                            ...Slides.getImgFixedStyle(this.state.imgWidth, this.state.imgHeight, this.state.windowWidth, this.state.windowHeight),
                            ...Slides.getImgStartStyle(this.state.imgWidth, this.state.imgHeight, this.state.windowWidth, this.state.windowHeight)
                        }}/>
                </VelocityComponent>
            </div>

        );
    }
}

export default Slides;
