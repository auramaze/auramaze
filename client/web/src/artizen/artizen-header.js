import React, {Component} from 'react';
import artist from '../icons/artist.svg';
import museum from '../icons/museum.svg';
import genre from '../icons/genre.svg';
import style from '../icons/style.svg';
import critic from '../icons/critic.svg';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import './artizen-header.css';

class ArtizenHeader extends Component {
    static convertArtizenTypeToIcon(artizenType) {
        const artizenTypeToIcon = {
            artist, museum, genre, style, critic
        };
        return artizenTypeToIcon[artizenType];
    }

    render() {
        const {avatar, name, type, ...props} = this.props;
        return (
            <div className="artizen-header" {...props}>
                {avatar ?
                    <div className="artizen-header-avatar">
                        <img
                            src={avatar}
                            alt="avatar"
                            className="artizen-header-avatar-img"
                        />
                    </div> :
                    <div className="artizen-header-avatar" style={{backgroundColor: '#cdcdcd'}}/>}
                <div className="artizen-header-name">{name}</div>
                {type && type.length > 0 &&
                <div className="artizen-badges">
                    {type.map(type =>
                        <img
                            key={type}
                            title={type}
                            alt={type}
                            src={ArtizenHeader.convertArtizenTypeToIcon(type)}
                            className="artizen-badge"
                        />)}
                </div>}
            </div>
        );
    }
}

export default ArtizenHeader;
