import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import * as Scroll from 'react-scroll';
import logo from '../static/logo-white-frame.svg';
import './navbar.css';

const scroll = Scroll.animateScroll;

class Navbar extends Component {
    render() {
        return (
            <div className="navbar" style={{backgroundColor: this.props.home ? "" : "#000000"}}>
                <div className="nav-items">
                    <div className="nav-item">
                        {this.props.home ?
                            <a onClick={() => {
                                scroll.scrollToBottom();
                            }}>Contact</a> :
                            <a href="/#contact">Contact</a>}
                    </div>
                    <div className="nav-item">
                        {this.props.home ?
                            <a onClick={() => {
                                scroll.scrollTo(document.documentElement.clientHeight);
                            }}>About</a> :
                            <a href="/#about">About</a>}
                    </div>
                </div>
                <div className="nav-logo">
                    <Link to="/">
                        <img src={logo} className="logo-header" alt="logo"/>
                    </Link>
                </div>
                <div className="nav-toggle">
                </div>
            </div>
        );
    }
}

Navbar.propTypes = {
    home: PropTypes.bool,
};

export default Navbar;
