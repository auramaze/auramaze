import React, {Component} from 'react';
import request from 'request';
import Slide from './Slide';
import {API_ENDPOINT} from './Common';
import './Slides.css';

class Slides extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            reverse: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.updateImages = this.updateImages.bind(this);
    }

    componentDidMount() {
        request.get({url: `${API_ENDPOINT}/slide`, json: true}, function (error, response, body) {
            if (response && response.statusCode === 200 && body.length > 0) {
                this.setState({urls: body, images: Array.apply(null, Array(body.length))});
                request.get({url: body[0], encoding: null}, function (error, response, body) {
                    const data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
                    const image = new Image();
                    image.onload = function () {
                        this.setState({
                            imgWidth: image.width,
                            imgHeight: image.height,
                        });
                    }.bind(this);
                    image.src = data;
                    this.setState({
                        imgSrc: data,
                        index: 0
                    });
                }.bind(this));
            }
        }.bind(this));
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({windowWidth: window.innerWidth, windowHeight: window.innerHeight});
    }

    updateImages() {
        this.setState({
            imgSrc: 'https://s3.us-east-2.amazonaws.com/auramaze-test/slides/fighting-temeraire.jpg',
            imgWidth: 800,
            imgHeight: 525,
            reverse: !this.state.reverse
        });
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
                {this.state && this.state.imgSrc && this.state.imgWidth && this.state.imgHeight &&
                <Slide
                    key={this.state.imgSrc}
                    imgSrc={this.state.imgSrc}
                    imgWidth={this.state.imgWidth}
                    imgHeight={this.state.imgHeight}
                    windowWidth={this.state.windowWidth}
                    windowHeight={this.state.windowHeight}
                    reverse={this.state.reverse}
                    onComplete={this.updateImages}
                />}
            </div>
        );
    }
}

export default Slides;
