import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';
import * as Scroll from 'react-scroll';
import {AuthContext} from '../app';
import logo from '../static/logo-white-frame.svg';
import './navbar.css';

const scroll = Scroll.animateScroll;

class Navbar extends Component {
    render() {
        return (
            <AuthContext.Consumer>
                {({auth, login}) => (
                    <div className="navbar" style={{backgroundColor: this.props.home ? '' : '#000000'}}>
                        <div className="nav-items">
                            <div className="nav-item">
                                {auth.id ?
                                    <Link to={`/artizen/${auth.id}`}>{auth.id}</Link> :
                                    <Link to="#" onClick={(e) => {
                                        e.preventDefault();
                                        login(100240736, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMjQwNzM2LCJleHAiOjE1NDY3Mzc1NDIsImlhdCI6MTU0MTU1MzU0Mn0.gqSCvZ8OCXhkXpumwY0yG-xbU5QS_i6eBMPtvNMEUs4');
                                    }}>Log in</Link>}
                            </div>
                            <div className="nav-item">
                                {this.props.home ?
                                    <Link to="#" onClick={(e) => {
                                        e.preventDefault();
                                        scroll.scrollToBottom();
                                    }}>Contact</Link> :
                                    <HashLink to="/#contact">Contact</HashLink>}
                            </div>
                            <div className="nav-item">
                                {this.props.home ?
                                    <Link to="#" onClick={(e) => {
                                        e.preventDefault();
                                        scroll.scrollTo(document.documentElement.clientHeight);
                                    }}>About</Link> :
                                    <HashLink to="/#about">About</HashLink>}
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
                )}
            </AuthContext.Consumer>
        );
    }
}

Navbar.propTypes = {
    home: PropTypes.bool,
};

export default Navbar;
