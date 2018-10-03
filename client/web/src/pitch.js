import React, {Component} from 'react';
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

export default Pitch;
