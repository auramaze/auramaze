import React, {Component} from 'react';

class Slide extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            style: {
                ...Slide.getImgFixedStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight),
                ...Slide.getImgStartStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight),
                opacity: 0
            }
        });
    }

    componentDidMount() {
        setTimeout(function () {
            this.setState({
                style: {
                    ...Slide.getImgFixedStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight),
                    ...Slide.getImgEndStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight),
                    opacity: 1
                }
            });
        }.bind(this), 0);
        setTimeout(function () {
            this.setState({
                style: {
                    ...Slide.getImgFixedStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight),
                    ...Slide.getImgEndStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight),
                    opacity: 0
                }
            });
        }.bind(this), Slide.getImgAnimDuration(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight) - 1000);
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
                transition: `all ${this.getImgAnimDuration(imgWidth, imgHeight, windowWidth, windowHeight)}ms, opacity 1000ms`
            };
        } else {
            return {
                marginTop: windowHeight - imgHeight * windowWidth / imgWidth,
                transition: `all ${this.getImgAnimDuration(imgWidth, imgHeight, windowWidth, windowHeight)}ms, opacity 1000ms`
            };
        }
    }

    static getImgEndStyle(imgWidth, imgHeight, windowWidth, windowHeight) {
        if (imgWidth / imgHeight > windowWidth / windowHeight) {
            return {
                marginLeft: 0,
                transition: `all ${this.getImgAnimDuration(imgWidth, imgHeight, windowWidth, windowHeight)}ms, opacity 1000ms`
            };
        } else {
            return {
                marginTop: 0,
                transition: `all ${this.getImgAnimDuration(imgWidth, imgHeight, windowWidth, windowHeight)}ms, opacity 1000ms`
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
