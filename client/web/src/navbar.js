import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import logo from './logo-white-frame.svg';
import './navbar.css';

class Navbar extends Component {
    render() {
        return (
            <div className="navbar">
                <div className="nav-items">
                    <div className="nav-item"><Link to="/#contact">Contact</Link></div>
                    <div className="nav-item"><Link to="/#about">About</Link></div>
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

export default Navbar;
