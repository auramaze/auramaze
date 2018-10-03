import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import logo from './logo-white-frame.svg';
import './navbar-mobile.css';

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
            <div className="navbar-mobile">
                <div className={this.state.expand ? 'nav-items-mobile-expand' : 'nav-items-mobile-collapse'}
                    style={{width: this.state.windowWidth, height: this.state.windowHeight}}>
                    <div className="nav-items-wrapper-mobile">
                        <div className="nav-item-mobile"><Link to="/login">Log in</Link></div>
                        <div className="nav-item-mobile"><Link to="/signup">Sign up</Link></div>
                        <div className="nav-item-mobile"><Link to="/search">Search</Link></div>
                        <div className="nav-item-mobile"><Link to="/topics">Topics</Link></div>
                    </div>
                </div>
                <div className="nav-logo-mobile">
                    <Link to="/">
                        <img src={logo} className="logo-mobile" alt="logo"/>
                    </Link>
                </div>
                <div className={`nav-toggle ${this.state.expand && 'nav-toggle-cancel'}`} onClick={() => {
                    this.setState({expand: !this.state.expand});
                }}>
                    <div className="nav-toggle-line" id="nav-toggle-1"></div>
                    <div className="nav-toggle-line" id="nav-toggle-2"></div>
                    <div className="nav-toggle-line" id="nav-toggle-3"></div>
                </div>
            </div>
        );
    }
}

export default NavbarMobile;
