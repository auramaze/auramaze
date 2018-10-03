import React, {Component} from 'react';
import PropTypes from 'prop-types';
import request from 'request';
import Slide from './slide';
import Searchbox from './searchbox';
import {API_ENDPOINT} from './common';
import './slides.css';

class Slides extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reverse: false
        };
        this.updateImage = this.updateImage.bind(this);
        this.getNextIndex = this.getNextIndex.bind(this);
        this.loadImage = this.loadImage.bind(this);
    }

    componentDidMount() {
        request.get({url: `${API_ENDPOINT}/slide`, json: true}, (error, response, body) => {
            if (response && response.statusCode === 200 && body.length > 1) {
                this.setState({urls: body, index: 0});
                for (let index of [0, 1]) {
                    this.loadImage(body, index);
                }
            }
        });
    }

    updateImage() {
        let nextIndex;
        if (this.state[`imgSrc-${this.getNextIndex()}`] && this.state[`imgWidth-${this.getNextIndex()}`] && this.state[`imgHeight-${this.getNextIndex()}`]) {
            nextIndex = this.getNextIndex();
        } else {
            nextIndex = 0;
        }
        this.setState({
            index: nextIndex,
            reverse: !this.state.reverse
        });
        this.loadImage(this.state.urls, (nextIndex + 1) % this.state.urls.length);
    }

    loadImage(urls, index) {
        if (this.state[`imgSrc-${index}`] && this.state[`imgWidth-${index}`] && this.state[`imgHeight-${index}`]) {
            return;
        }
        request.get({url: urls[index], encoding: null}, function (error, response, body) {
            const data = 'data:' + response.headers['content-type'] + ';base64,' + new Buffer(body).toString('base64');
            const image = new Image();
            image.onload = function () {
                this.setState({
                    [`imgWidth-${index}`]: image.width,
                    [`imgHeight-${index}`]: image.height
                });
            }.bind(this);
            image.src = data;
            this.setState({
                [`imgSrc-${index}`]: data,
            });
        }.bind(this));
    }

    getNextIndex() {
        return (this.state.index + 1) % this.state.urls.length;
    }

    render() {
        return (
            <div className="slides"
                style={{
                    height: this.props.windowHeight,
                    width: this.props.windowWidth,
                }}>
                {(this.state && this.state.hasOwnProperty('index') && this.state[`imgSrc-${this.state.index}`] && this.state[`imgWidth-${this.state.index}`] && this.state[`imgHeight-${this.state.index}`]) &&
                <Slide
                    key={this.state.index}
                    imgSrc={this.state[`imgSrc-${this.state.index}`]}
                    imgWidth={this.state[`imgWidth-${this.state.index}`]}
                    imgHeight={this.state[`imgHeight-${this.state.index}`]}
                    windowWidth={this.props.windowWidth}
                    windowHeight={this.props.windowHeight}
                    reverse={this.state.reverse}
                    onComplete={this.updateImage}
                />}
                <Searchbox style={{
                    position: 'absolute',
                    width: 500,
                    maxWidth: '80%',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}/>
            </div>
        );
    }
}

Slides.propTypes = {
    windowWidth: PropTypes.number,
    windowHeight: PropTypes.number,
};

export default Slides;
