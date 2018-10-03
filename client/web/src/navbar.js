import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import logo from './logo-white-frame.svg';
import './navbar.css';

class Navbar extends Component {
    render() {
        return (
            <div className="navbar">
                <div className="nav-items">
                    <div className="nav-item"><Link to="/login">Log in</Link></div>
                    <div className="nav-item"><Link to="/signup">Sign up</Link></div>
                    <div className="nav-item"><Link to="/search">Search</Link></div>
                    <div className="nav-item"><Link to="/topics">Topics</Link></div>
                </div>
                <div className="nav-logo">
                    <Link to="/">
                        <img src={logo} className="logo" alt="logo"/>
                    </Link>
                </div>
                <div className="nav-toggle">
                </div>
            </div>
        );
    }
}

export default Navbar;
