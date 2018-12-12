import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import MobileStoreButton from 'react-mobile-store-button';
import logo from '../static/logo-white-frame.svg';
import './footer.css';
import {WindowContext} from "../app";

const iOSUrl = 'https://itunes.apple.com/us/app/auramaze/id1445348108?ls=1&mt=8';
const androidUrl = 'https://play.google.com/store/apps/details?id=org.auramaze.auramaze&hl=en';


class Footer extends Component {
    static isWideScreen(windowWidth) {
        return windowWidth > 768;
    }

    render() {
        return (
            <WindowContext.Consumer>
                {({windowWidth}) => (
                    <div className="footer" id="contact">
                        <table>
                            <tbody>
                            <tr>
                                {Footer.isWideScreen(windowWidth) &&
                                <td width="20%">
                                    <img src={logo} className="logo-footer" alt="logo"/>
                                </td>}
                                <td width={Footer.isWideScreen(windowWidth) ? '40%' : '80%'}>
                                    <div className="contact-info">
                                        Email: <br/><a className="footer-link"
                                                       href="mailto:service@auramaze.org">service@auramaze.org</a><br/>Address:
                                        <br/>1760 Broadway St.<br/>Ann Arbor, MI 48105<br/><br/>
                                        <Link className="footer-link" to="/privacy">Privacy Policy</Link><br/>
                                    </div>
                                </td>
                                {Footer.isWideScreen(windowWidth) &&
                                <td width="40%">
                                    <div>
                                        <MobileStoreButton
                                            store="ios"
                                            url={iOSUrl}
                                        />
                                    </div>
                                    <br/>
                                    <div>
                                        <MobileStoreButton
                                            store="android"
                                            url={androidUrl}
                                        />
                                    </div>
                                </td>}
                            </tr>
                            {!Footer.isWideScreen(windowWidth) &&
                            <div>
                                <tr>
                                    <td width="80%">
                                        <MobileStoreButton
                                            store="ios"
                                            url={iOSUrl}
                                        />
                                    </td>
                                </tr>
                                <br/>
                                <tr>
                                    <td width="80%">
                                        <MobileStoreButton
                                            store="android"
                                            url={androidUrl}
                                        />
                                    </td>
                                </tr>
                            </div>}
                            </tbody>
                        </table>

                    </div>)}
            </WindowContext.Consumer>
        );
    }
}

export default Footer;
