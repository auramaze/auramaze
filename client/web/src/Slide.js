import React, {Component} from 'react';
import {VelocityComponent} from 'velocity-react';

class Slide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {
                ...Slide.getImgFixedStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight),
                ...Slide.getImgStartStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight)
            }
        };
    }

    componentWillMount() {
        this.setState({
            style: {
                ...Slide.getImgFixedStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight),
                ...Slide.getImgStartStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight)
            }
        });
    }

    componentDidMount() {
        setTimeout(function () {
            this.setState({
                style: {
                    ...Slide.getImgFixedStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight),
                    ...Slide.getImgEndStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight),
                }
            });
        }.bind(this), 0);
        setTimeout(function () {
            this.props.onComplete();
        }.bind(this), Slide.getImgAnimDuration(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight))
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
            return {
                marginLeft: windowWidth - imgWidth * windowHeight / imgHeight,
                transition: `all ${this.getImgAnimDuration(imgWidth, imgHeight, windowWidth, windowHeight)}ms`
            };
        } else {
            return {
                marginTop: windowHeight - imgHeight * windowWidth / imgWidth,
                transition: `all ${this.getImgAnimDuration(imgWidth, imgHeight, windowWidth, windowHeight)}ms`
            };
        }
    }

    static getImgEndStyle(imgWidth, imgHeight, windowWidth, windowHeight) {
        if (imgWidth / imgHeight > windowWidth / windowHeight) {
            return {
                marginLeft: 0,
                transition: `all ${this.getImgAnimDuration(imgWidth, imgHeight, windowWidth, windowHeight)}ms`
            };
        } else {
            return {
                marginTop: 0,
                transition: `all ${this.getImgAnimDuration(imgWidth, imgHeight, windowWidth, windowHeight)}ms`
            };
        }
    }

    static getImgAnimDuration(imgWidth, imgHeight, windowWidth, windowHeight) {
        let distance;
        if (imgWidth / imgHeight > windowWidth / windowHeight) {
            distance = imgWidth * windowHeight / imgHeight - windowWidth;
        } else {
            distance = imgHeight * windowWidth / imgWidth - windowHeight;
        }
        return Math.round(distance * 20);
    }

    render() {
        return (
            <img
                src={this.props.imgSrc}
                style={this.state.style}/>
        );
    }
}

export default Slide;
