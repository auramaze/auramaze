import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {faCamera} from '@fortawesome/free-solid-svg-icons';
import {faHeadphonesAlt} from '@fortawesome/free-solid-svg-icons';
import {faShareAlt} from '@fortawesome/free-solid-svg-icons';
import Fade from 'react-reveal/Fade';
import PitchCard from './pitch-card';
import './pitch.css';
import {WindowContext} from "../app";

class Pitch extends Component {
    static isWideScreen(windowWidth) {
        return windowWidth > 768;
    }

    render() {
        return (
            <WindowContext.Consumer>
                {({windowWidth}) => (
                    <div className={Pitch.isWideScreen(windowWidth) ? 'pitch' : 'pitch-mobile'} id="about">
                        <div className="demo">
                            <img src="https://s3.us-east-2.amazonaws.com/auramaze-test/static/auramaze-demo.png"
                                 alt="demo"/>
                        </div>
                        <div className="topics">
                            <div className="pitch-cards">
                                <Fade right={Pitch.isWideScreen(windowWidth)} bottom={!Pitch.isWideScreen(windowWidth)}>
                                    <PitchCard
                                        cardTitle={'VIEW'}
                                        cardText={'Painting identification with camera and image search engine'}
                                        cardIconSrc={faCamera}
                                    />
                                </Fade>
                                <Fade right={Pitch.isWideScreen(windowWidth)} bottom={!Pitch.isWideScreen(windowWidth)}>
                                    <PitchCard
                                        cardTitle={'HEAR'}
                                        cardText={'Text-to-speech on introductions via Wikipedia & art experts'}
                                        cardIconSrc={faHeadphonesAlt}
                                    />
                                </Fade>
                                <Fade right={Pitch.isWideScreen(windowWidth)} bottom={!Pitch.isWideScreen(windowWidth)}>
                                    <PitchCard
                                        cardTitle={'SHARE'}
                                        cardText={'Platform for every art lover to review favorite artworks'}
                                        cardIconSrc={faShareAlt}
                                    />
                                </Fade>
                            </div>
                        </div>
                    </div>)}
            </WindowContext.Consumer>
        );
    }
}

export default Pitch;
