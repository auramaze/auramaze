import React, {Component} from 'react';
import {VelocityComponent} from 'velocity-react';

class Slide extends Component {
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
        return distance * 20;
    }

    render() {
        return (
            <VelocityComponent
                animation={Slide.getImgEndStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight)}
                duration={Slide.getImgAnimDuration(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight)}
                runOnMount
                complete={this.props.onComplete}>
                <img
                    src={this.props.imgSrc}
                    style={{
                        ...Slide.getImgFixedStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight),
                        ...Slide.getImgStartStyle(this.props.imgWidth, this.props.imgHeight, this.props.windowWidth, this.props.windowHeight)
                    }}/>
            </VelocityComponent>
        );
    }
}

export default Slide;
