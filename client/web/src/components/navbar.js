import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';
import {FormattedMessage} from 'react-intl';
import * as Scroll from 'react-scroll';
import {ModalContext} from '../app';
import logo from '../static/logo-white-frame.svg';
import './navbar.css';
import {withCookies} from "react-cookie";
import {removeCookies} from "../utils";

const scroll = Scroll.animateScroll;

class Navbar extends Component {
    render() {
        const home = this.props.home;
        const {cookies} = this.props;
        const id = cookies.get('id');
        const username = cookies.get('username');
        return (
            <ModalContext.Consumer>
                {({showSignupModal, showLoginModal}) => (
                    <div className="navbar" style={{backgroundColor: home ? '' : '#000000'}}>
                        <div className="nav-items">
                            {id && <div className="nav-item">
                                <Link to="#" onClick={(e) => {
                                    e.preventDefault();
                                    removeCookies(cookies);
                                    window.location.reload();
                                }}><FormattedMessage id="app.navbar.logout"/></Link>
                            </div>}
                            {id && <div className="nav-item">
                                <Link
                                    to={`/artizen/${username || id}`}>{username || id}
                                </Link>
                            </div>}
                            {!id && <div className="nav-item">
                                <Link to="#" onClick={(e) => {
                                    e.preventDefault();
                                    showLoginModal();
                                }}><FormattedMessage id="app.navbar.login"/></Link>
                            </div>}
                            {!id && <div className="nav-item">
                                <Link to="#" onClick={(e) => {
                                    e.preventDefault();
                                    showSignupModal();
                                }}><FormattedMessage id="app.navbar.signup"/></Link>
                            </div>}
                            <div className="nav-item">
                                {home ?
                                    <Link to="#" onClick={(e) => {
                                        e.preventDefault();
                                        scroll.scrollTo(document.documentElement.clientHeight);
                                    }}>
                                        <FormattedMessage id="app.navbar.about"/>
                                    </Link> :
                                    <HashLink to="/#about">
                                        <FormattedMessage id="app.navbar.about"/>
                                    </HashLink>}
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
            </ModalContext.Consumer>
        );
    }
}

Navbar.propTypes = {
    home: PropTypes.bool,
};

export default withCookies(Navbar);
