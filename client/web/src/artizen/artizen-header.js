import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import './artizen-header.css';

class ArtizenHeader extends Component {
    render() {
        const {avatar, name, ...props} = this.props;
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
            </div>
        );
    }
}

export default ArtizenHeader;
