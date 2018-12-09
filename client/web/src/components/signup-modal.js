import React, {Component} from 'react';
import request from 'request';
import {withCookies} from "react-cookie";
import {injectIntl, FormattedMessage} from 'react-intl';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckCircle} from '@fortawesome/free-regular-svg-icons';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import GoogleLogin from 'react-google-login';
import Modal from './modal';
import Inputbox from './inputbox';
import Buttonbox from './buttonbox';
import auramaze from '../static/logo-white-frame.svg';
import './signup-modal.css';
import {API_ENDPOINT, API_URL} from "../common";
import OAuthButtonbox from "./oauth-buttonbox";
import {validateEmail, validatePassword} from "../utils";

const inputboxStyle = {margin: '20px 0', width: '100%'};
const buttonboxStyle = {
    margin: '20px 0',
    width: '100%',
    height: 50,
    borderRadius: 5,
    whiteSpace: 'nowrap'
};
const auramazeButtonboxStyle = Object.assign({
    backgroundColor: '#cdcdcd',
    color: '#666666'
}, buttonboxStyle);

const responseGoogle = (response) => {
    console.log(response);
}

class SignupModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            auramazeProcessing: false,
            displayNameMessage: false,
            displayEmailMessage: false,
            displayPasswordMessage: false,
            emailExist: false
        };
        this.signup = this.signup.bind(this);
    }

    signup() {
        this.setState({auramazeProcessing: true});
        request.post({
            url: `${API_ENDPOINT}/auth/signup`,
            body: {name: {default: this.state.name}, email: this.state.email, password: this.state.password},
            json: true
        }, (error, response, body) => {
            if (response && response.statusCode === 200) {
                const {cookies} = this.props;
                if (body.id) {
                    cookies.set('id', body.id, {path: '/'});
                } else {
                    cookies.remove('id', {path: '/'});
                }
                if (body.username) {
                    cookies.set('username', body.username, {path: '/'});
                } else {
                    cookies.remove('username', {path: '/'});
                }
                if (body.token) {
                    cookies.set('token', body.token, {path: '/'});
                } else {
                    cookies.remove('token', {path: '/'});
                }
                this.setState({id: '', password: '', auramazeProcessing: false});
                window.location.reload();
            } else if (response.statusCode === 400) {
                if (body.code === 'EMAIL_EXIST') {
                    this.setState({emailExist: true});
                }
                this.setState({auramazeProcessing: false});
            }
        });
    }

    signGoogle = (response) => {
        const body = {
            id: response.profileObj.googleId,
            name: response.profileObj.name,
            picture: response.profileObj.imageUrl
        };

        request.post({
            url: `${API_ENDPOINT}/auth/google`,
            body: body,
            json: true
        }, (error, response, body) => {
            if (response && response.statusCode === 200) {
                const {cookies} = this.props;
                if (body.id) {
                    cookies.set('id', body.id, {path: '/'});
                } else {
                    cookies.remove('id', {path: '/'});
                }
                if (body.username) {
                    cookies.set('username', body.username, {path: '/'});
                } else {
                    cookies.remove('username', {path: '/'});
                }
                if (body.token) {
                    cookies.set('token', body.token, {path: '/'});
                } else {
                    cookies.remove('token', {path: '/'});
                }
                this.setState({id: '', password: '', auramazeProcessing: false});
                window.location.reload();
            }
        });
    };

    render() {
        const {intl} = this.props;
        return (
            <Modal {...this.props} style={{
                width: '95%',
                maxWidth: 800
            }}>
                <div className="signup-modal-content">
                    <p className="font-size-xl">
                        <FormattedMessage id="app.signup.title"/>
                    </p>
                    <Inputbox
                        style={inputboxStyle}
                        value={this.state.name}
                        type="text"
                        name="name"
                        placeholder={intl.formatMessage({id: 'app.signup.name'})}
                        onChange={(value) => {
                            this.setState({name: value})
                        }}
                        onBlur={() => {
                            this.setState({displayNameMessage: true})
                        }}
                    />
                    {this.state.displayNameMessage && <div className="message-container">
                        {this.state.name.length > 0 &&
                        <div className="font-size-xs success-message"><FontAwesomeIcon
                            icon={faCheckCircle}
                            size="sm"
                        /> <FormattedMessage id="app.signup.name_valid"/></div>}
                        {this.state.name.length === 0 &&
                        <div className="font-size-xs error-message"><FontAwesomeIcon
                            icon={faTimesCircle}
                            size="sm"
                        /> <FormattedMessage id="app.signup.name_required"/></div>}
                    </div>}
                    <Inputbox
                        style={inputboxStyle}
                        value={this.state.email}
                        type="text"
                        name="email"
                        placeholder={intl.formatMessage({id: 'app.signup.email'})}
                        onChange={(value) => {
                            this.setState({email: value, emailExist: false})
                        }}
                        onBlur={() => {
                            this.setState({displayEmailMessage: true})
                        }}
                    />
                    {this.state.displayEmailMessage && <div className="message-container">
                        {validateEmail(this.state.email) && !this.state.emailExist &&
                        <div className="font-size-xs success-message"><FontAwesomeIcon
                            icon={faCheckCircle}
                            size="sm"
                        /> <FormattedMessage id="app.signup.email_valid"/></div>}
                        {!validateEmail(this.state.email) &&
                        <div className="font-size-xs error-message"><FontAwesomeIcon
                            icon={faTimesCircle}
                            size="sm"
                        /> <FormattedMessage id="app.signup.email_invalid"/></div>}
                        {this.state.emailExist && <div className="font-size-xs error-message"><FontAwesomeIcon
                            icon={faTimesCircle}
                            size="sm"
                        /> <FormattedMessage id="app.signup.email_exists"/></div>}
                    </div>}
                    <Inputbox
                        style={inputboxStyle}
                        value={this.state.password}
                        type="password"
                        name="password"
                        placeholder={intl.formatMessage({id: 'app.signup.password'})}
                        onChange={(value) => {
                            this.setState({password: value})
                        }}
                        onBlur={() => {
                            this.setState({displayPasswordMessage: true})
                        }}
                    />
                    {this.state.displayPasswordMessage && <div className="message-container">
                        {validatePassword(this.state.password) ?
                            <div className="font-size-xs success-message"><FontAwesomeIcon
                                icon={faCheckCircle}
                                size="sm"
                            /> <FormattedMessage id="app.signup.password_valid"/></div> :
                            <div className="font-size-xs error-message"><FontAwesomeIcon
                                icon={faTimesCircle}
                                size="sm"
                            /> <FormattedMessage id="app.signup.password_longer"/></div>}
                    </div>}
                    <div style={{width: '100%', height: 5}}/>
                    <Buttonbox
                        style={auramazeButtonboxStyle}
                        processing={this.state.auramazeProcessing}
                        onClick={() => {
                            this.signup();
                        }}
                    >
                        <div style={{color: '#666666', display: 'inlineBlock', margin: '0 10px'}}>
                            <img src={auramaze} alt="auramaze"
                                 style={{width: 25, height: 25, marginRight: 10, verticalAlign: 'middle'}}/>
                            <span
                                style={{
                                    display: 'inlineBlock',
                                    verticalAlign: 'middle'
                                }}><FormattedMessage id="app.signup.auramaze"/></span>
                        </div>
                    </Buttonbox>
                    <div style={{width: '100%', height: 0, borderBottom: 'solid 1px #666666'}}/>
                    <GoogleLogin
                        clientId="340126114858-n6rlvgkbb1qt10qtcvclq0b93qtfrsfq.apps.googleusercontent.com"
                        render={renderProps => (
                            <OAuthButtonbox signup provider="google" onClick={renderProps.onClick}/>
                        )}
                        buttonText="Login"
                        onSuccess={this.signGoogle}
                        onFailure={() => {
                            alert('Google Login Error');
                        }}
                    />
                </div>
            </Modal>
        );
    }
}

export default withCookies(injectIntl(SignupModal));
