import React, {Component} from 'react';
import './Navbar.css';
import {Link} from "react-router-dom";
import logo from './logo-white-frame.svg';

class Navbar extends Component {
    render() {
        return (
            <div className="Navbar">
                <div className="Nav-logo">
                    <Link to="/">
                        <img src={logo} className="Logo" alt="logo"/>
                    </Link>
                </div>
                <div className="Nav-items">
                    <div className="Nav-item"><Link to="/login">Log in</Link></div>
                    <div className="Nav-item"><Link to="/signup">Sign up</Link></div>
                    <div className="Nav-item"><Link to="/search">Search</Link></div>
                    <div className="Nav-item"><Link to="/topics">Topics</Link></div>
                </div>
            </div>
        );
    }
}

export default Navbar;
