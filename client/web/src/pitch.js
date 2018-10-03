import React, {Component} from 'react';
import demo from './auramaze-demo.png';
import './pitch.css';

class Pitch extends Component {
    isWideScreen() {
        return this.props.windowWidth > 768;
    }

    render() {
        return (
            <div className={this.isWideScreen() ? 'pitch' : 'pitch-mobile'}>
                <div className="demo">
                    <img src={demo} alt="demo"/>
                </div>
                <div className="topics"></div>
            </div>
        );
    }
}

export default Pitch;
