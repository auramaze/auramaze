import React, {Component} from 'react';
import PropTypes from 'prop-types';

const fadeTime = 2500;

class Slide extends Component {
    constructor(props) {
        super(props);
        const imgStartStyle = (props.reverse ? Slide.getImgEndStyle : Slide.getImgStartStyle)(props.imgWidth, props.imgHeight, props.windowWidth, props.windowHeight);
        this.state = {
            style: {
                ...imgStartStyle,
                opacity: 0
            }
        };
    }

    componentDidMount() {
        const duration = Slide.getImgAnimDuration(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight);
        const imgEndStyle = (this.props.reverse ? Slide.getImgStartStyle : Slide.getImgEndStyle)(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight);

        setTimeout(function () {
            this.setState({
                style: {
                    ...imgEndStyle,
                    opacity: 1
                }
            });
        }.bind(this), 0);

        setTimeout(function () {
            this.setState({
                style: {
                    ...imgEndStyle,
                    opacity: 0
                }
            });
        }.bind(this), duration - fadeTime);

        setTimeout(function () {
            this.props.onComplete();
        }.bind(this), duration);
    }

    static getImgFixedStyle(imgWidth, imgHeight, windowWidth, windowHeight) {
        if (imgWidth / imgHeight > windowWidth / windowHeight) {
            return {height: windowHeight};
        } else {
            return {width: windowWidth};
        }
    }

    static getImgStartStyle(imgWidth, imgHeight, windowWidth, windowHeight) {
        const duration = Slide.getImgAnimDuration(imgWidth, imgHeight, windowWidth, windowHeight);
        if (imgWidth / imgHeight > windowWidth / windowHeight) {
            return {
                marginLeft: windowWidth - imgWidth * windowHeight / imgHeight,
                transition: `all ${duration}ms, opacity ${fadeTime}ms`
            };
        } else {
            return {
                marginTop: windowHeight - imgHeight * windowWidth / imgWidth,
                transition: `all ${duration}ms, opacity ${fadeTime}ms`
            };
        }
    }

    static getImgEndStyle(imgWidth, imgHeight, windowWidth, windowHeight) {
        const duration = Slide.getImgAnimDuration(imgWidth, imgHeight, windowWidth, windowHeight);
        if (imgWidth / imgHeight > windowWidth / windowHeight) {
            return {
                marginLeft: 0,
                transition: `all ${duration}ms, opacity ${fadeTime}ms`
            };
        } else {
            return {
                marginTop: 0,
                transition: `all ${duration}ms, opacity ${fadeTime}ms`
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
        return Math.max(Math.round(distance * 25), 7000);
    }

    render() {
        return (
            <img
                src={this.props.imgSrc}
                style={{...Slide.getImgFixedStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight), ...this.state.style}}/>
        );
    }
}

Slide.propTypes = {
    imgSrc: PropTypes.string,
    imgWidth: PropTypes.number,
    imgHeight: PropTypes.number,
    windowWidth: PropTypes.number,
    windowHeight: PropTypes.number,
    reverse: PropTypes.bool,
    onComplete: PropTypes.func
};

export default Slide;
