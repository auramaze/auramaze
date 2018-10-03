import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './pitch.css';

class Pitch extends Component {
    isWideScreen() {
        return this.props.windowWidth > 768;
    }

    render() {
        return (
            <div className={this.isWideScreen() ? 'pitch' : 'pitch-mobile'}>
                <div className="demo">
                    <img src="https://s3.us-east-2.amazonaws.com/auramaze-test/static/auramaze-demo.png" alt="demo"/>
                </div>
                <div className="topics"></div>
            </div>
        );
    }
}

Pitch.propTypes = {
    windowWidth: PropTypes.number,
    windowHeight: PropTypes.number,
};

export default Pitch;
