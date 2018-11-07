import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';
import * as Scroll from 'react-scroll';
import SignupModal from "./signup-modal";
import {AuthContext} from '../app';
import logo from '../static/logo-white-frame.svg';
import './navbar.css';

const scroll = Scroll.animateScroll;

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signupModalShow: false,
            loginModalShow: false
        };
        this.showSignupModal = this.showSignupModal.bind(this);
        this.hideSignupModal = this.hideSignupModal.bind(this);
    }

    showSignupModal() {
        this.setState({signupModalShow: true});
    };

    hideSignupModal() {
        this.setState({signupModalShow: false});
    };

    render() {
        return (
            <AuthContext.Consumer>
                {({auth, login}) => (
                    <div className="navbar" style={{backgroundColor: this.props.home ? '' : '#000000'}}>
                        <div className="nav-items">
                            <div className="nav-item">
                                {auth.id ?
                                    <Link
                                        to={`/artizen/${auth.username || auth.id}`}>{auth.username || auth.id}</Link> :
                                    <Link to="#" onClick={(e) => {
                                        e.preventDefault();
                                        login(100240739, 'admin4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMjQwNzM5LCJleHAiOjE1NDY3NDE5MzQsImlhdCI6MTU0MTU1NzkzNH0.gbK2IiZ7CF64Qk7QYWDrlf92sW2gmaPvvYLPem1FxKE');
                                    }}>Log in</Link>}
                            </div>
                            {!auth.id && <div className="nav-item">
                                <Link to="#" onClick={(e) => {
                                    e.preventDefault();
                                    this.showSignupModal();
                                }}>Sign up</Link>
                            </div>}
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
                        <SignupModal show={this.state.signupModalShow} handleClose={this.hideSignupModal}/>
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
