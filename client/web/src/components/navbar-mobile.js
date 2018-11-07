import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';
import * as Scroll from 'react-scroll';
import logo from '../static/logo-white-frame.svg';
import './navbar-mobile.css';

const scroll = Scroll.animateScroll;

class NavbarMobile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight,
            expand: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight
        });
    }

    render() {
        return (
            <div className="navbar-mobile" style={{backgroundColor: this.props.home ? '' : '#000000'}}>
                <div
                    className={`nav-items-mobile ${!this.state.expand && 'nav-items-mobile-collapse'}`}
                    style={{width: this.state.windowWidth, height: this.state.windowHeight}}
                >
                    <div className="nav-items-wrapper-mobile">
                        <div className="nav-item-mobile">
                            {this.props.home ?
                                <Link to="#" onClick={(e) => {
                                    e.preventDefault();
                                    document.body.style.overflow = 'visible';
                                    this.setState({expand: false});
                                    scroll.scrollTo(document.documentElement.clientHeight);
                                }}>About</Link> :
                                <HashLink to="/#about" onClick={() => {
                                    document.body.style.overflow = 'visible';
                                    this.setState({expand: false});
                                }}>About</HashLink>}
                        </div>
                        <div className="nav-item-mobile">
                            {this.props.home ?
                                <Link to="#" onClick={(e) => {
                                    e.preventDefault();
                                    document.body.style.overflow = 'visible';
                                    this.setState({expand: false});
                                    scroll.scrollToBottom();
                                }}>Contact</Link> :
                                <HashLink to="/#contact" onClick={() => {
                                    document.body.style.overflow = 'visible';
                                    this.setState({expand: false});
                                }}>Contact</HashLink>}
                        </div>
                        <div className="nav-item-mobile">
                            <Link to="#" onClick={(e) => {
                                e.preventDefault();
                                document.body.style.overflow = 'visible';
                                this.setState({expand: false});
                            }}>Log in</Link>
                        </div>
                    </div>
                </div>
                <div className="nav-logo-mobile">
                    <Link to="/">
                        <img src={logo} className="logo-mobile" alt="logo"/>
                    </Link>
                </div>
                <div className={`nav-toggle ${this.state.expand && 'nav-toggle-cancel'}`} onClick={() => {
                    document.body.style.overflow = this.state.expand ? 'visible' : 'hidden';
                    this.setState({expand: !this.state.expand});
                }}>
                    <div className="nav-toggle-line" id="nav-toggle-1"/>
                    <div className="nav-toggle-line" id="nav-toggle-2"/>
                    <div className="nav-toggle-line" id="nav-toggle-3"/>
                </div>
            </div>
        );
    }
}

NavbarMobile.propTypes = {
    home: PropTypes.bool,
};

export default NavbarMobile;
