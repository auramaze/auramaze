import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Scrollbars} from 'react-custom-scrollbars';
import {generateHighlightContent} from '../utils';
import ArtizenCard from './artizen-card';
import {LanguageContext} from '../app';
import {getLocaleValue} from '../utils';
import './artizen-card-layout.css';

class ArtizenCardLayout extends Component {
    render() {
        return (<LanguageContext.Consumer>
                {({language}) => (
                    <div className="artizen-card-layout" style={{height: this.props.extended ? 300 : 130}}>
                        <Scrollbars style={{width: '100%', height: '100%'}}>
                            <div className="artizen-container">
                                {this.props.artizens.map((artizen, index) =>
                                    <ArtizenCard
                                        key={index}
                                        style={{
                                            width: 280,
                                            display: 'inline-block',
                                            margin: 20,
                                            verticalAlign: 'top'
                                        }}
                                        id={artizen.id}
                                        username={artizen.username}
                                        name={getLocaleValue(artizen.name, language)}
                                        avatar={artizen.avatar}
                                        abstract={generateHighlightContent(artizen._highlight)}
                                        extended={this.props.extended}
                                    />)}
                            </div>
                        </Scrollbars>
                        <div className="artizen-container-mask-left"/>
                        <div className="artizen-container-mask-right"/>
                    </div>)}
            </LanguageContext.Consumer>
        );
    }
}

ArtizenCardLayout.propTypes = {
    artizens: PropTypes.array,
    extended: PropTypes.bool
};

export default ArtizenCardLayout;
