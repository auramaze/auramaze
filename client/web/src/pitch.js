import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCamera} from '@fortawesome/free-solid-svg-icons';
import {faHeadphonesAlt} from '@fortawesome/free-solid-svg-icons';
import {faShareAlt} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import './pitch.css';
import PitchCard from "./pitch-card";

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
                <div className="topics">
                    <PitchCard
                        cardTitle={"VIEW"}
                        cardText={"Painting identification with camera and image search engine"}
                        cardIconSrc={faCamera}
                    />
                    <PitchCard
                        cardTitle={"HEAR"}
                        cardText={"Text-to-speech on introductions via Wikipedia & art experts"}
                        cardIconSrc={faHeadphonesAlt}
                    />
                    <PitchCard
                        cardTitle={"SHARE"}
                        cardText={"Platform for every art lover to review favorite artworks"}
                        cardIconSrc={faShareAlt}
                    />
                </div>
            </div>
        );
    }
}

Pitch.propTypes = {
    windowWidth: PropTypes.number,
    windowHeight: PropTypes.number,
};

export default Pitch;
