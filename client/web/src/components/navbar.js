import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';
import * as Scroll from 'react-scroll';
import SignupModal from './signup-modal';
import LoginModal from './login-modal';
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
        this.showLoginModal = this.showLoginModal.bind(this);
        this.hideLoginModal = this.hideLoginModal.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.auth.id && !prevProps.auth.id) {
            this.setState({signupModalShow: false, loginModalShow: false});
        }
    }

    showSignupModal() {
        this.setState({signupModalShow: true});
    };

    hideSignupModal() {
        this.setState({signupModalShow: false});
    };

    showLoginModal() {
        this.setState({loginModalShow: true});
    };

    hideLoginModal() {
        this.setState({loginModalShow: false});
    };

    render() {
        const {auth, createAuth, ...props} = this.props;
        return (

            <div className="navbar" style={{backgroundColor: props.home ? '' : '#000000'}}>
                <div className="nav-items">

                    {auth.id && <div className="nav-item">
                        <Link
                            to={`/artizen/${auth.username || auth.id}`}>{auth.username || auth.id}
                        </Link>
                    </div>}
                    {!auth.id && <div className="nav-item">
                        <Link to="#" onClick={(e) => {
                            e.preventDefault();
                            this.showLoginModal();
                        }}>Log in</Link>
                    </div>}
                    {!auth.id && <div className="nav-item">
                        <Link to="#" onClick={(e) => {
                            e.preventDefault();
                            this.showSignupModal();
                        }}>Sign up</Link>
                    </div>}
                    <div className="nav-item">
                        {props.home ?
                            <Link to="#" onClick={(e) => {
                                e.preventDefault();
                                scroll.scrollToBottom();
                            }}>Contact</Link> :
                            <HashLink to="/#contact">Contact</HashLink>}
                    </div>
                    <div className="nav-item">
                        {props.home ?
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
                <LoginModal show={this.state.loginModalShow} handleClose={this.hideLoginModal}/>
            </div>
        );
    }
}

Navbar.propTypes = {
    home: PropTypes.bool,
};

export default React.forwardRef((props, ref) => (<AuthContext.Consumer>
    {({auth, createAuth}) => <Navbar {...props} auth={auth} createAuth={createAuth} ref={ref}/>}
</AuthContext.Consumer>));
