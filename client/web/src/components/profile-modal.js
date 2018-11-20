import React, {Component} from 'react';
import request from 'request';
import {withCookies} from "react-cookie";
import {injectIntl, FormattedMessage} from 'react-intl';
import io from 'socket.io-client'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckCircle} from '@fortawesome/free-regular-svg-icons';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import Modal from './modal';
import Inputbox from './inputbox';
import Buttonbox from './buttonbox';
import auramaze from '../static/logo-white-frame.svg';
import './profile-modal.css';
import {API_ENDPOINT, API_URL} from "../common";
import OAuthButtonbox from "./oauth-buttonbox";
import {removeCookies, validateEmail, validateUsername, validatePassword} from "../utils";
import {ModalContext, VoteContext} from "../app";

const socket = io(API_URL);
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

class ProfileModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            name: props.name,
            email: props.email,
            password: '',
            auramazeProcessing: false,
            displayNameMessage: false,
            displayUsernameMessage: false,
            displayEmailMessage: false,
            displayPasswordMessage: false,
            emailExist: false,
            usernameExist: false
        };
        this.updateProfile = this.updateProfile.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {username, name, email, show} = this.props;
        if (JSON.stringify(this.props.name) !== JSON.stringify(prevProps.name) || this.props.email !== prevProps.email || this.props.username !== prevProps.username || this.props.show !== prevProps.show) {
            this.setState({
                username, name, email,
                password: '',
                auramazeProcessing: false,
                displayNameMessage: false,
                displayUsernameMessage: false,
                displayEmailMessage: false,
                displayPasswordMessage: false,
                emailExist: false,
                usernameExist: false
            })
        }
    }

    updateProfile(showLoginModal) {
        const {cookies} = this.props;
        this.setState({auramazeProcessing: true});
        const body = {
            name: this.state.name,
            username: this.state.username,
            email: this.state.email,
        };
        if (validatePassword(this.state.password)) {
            body.password = this.state.password;
        }
        request.post({
            url: `${API_ENDPOINT}/artizen/${this.props.id}`,
            body: body,
            json: true
        }, (error, response, body) => {
            if (response && response.statusCode === 200) {
                if (this.state.username) {
                    cookies.set('username', this.state.username, {path: '/'});
                } else {
                    cookies.remove('username', {path: '/'});
                }
                this.setState({auramazeProcessing: false});
                window.location.reload();
            } else if (response.statusCode === 400) {
                if (body.code === 'EMAIL_EXIST') {
                    this.setState({emailExist: true});
                }
                if (body.code === 'USERNAME_EXIST') {
                    this.setState({usernameExist: true});
                }
                this.setState({auramazeProcessing: false});
            } else if (response.statusCode === 401) {
                removeCookies(cookies);
                showLoginModal();
            }
        });
    }

    render() {
        const {intl} = this.props;
        return (<ModalContext.Consumer>
                {({showLoginModal}) => (
                    <Modal {...this.props} style={{
                        width: '95%',
                        maxWidth: 800
                    }}>
                        <div className="profile-modal-content">
                            <p className="font-size-xl">
                                <FormattedMessage id="app.profile.title"/>
                            </p>
                            <Inputbox
                                style={inputboxStyle}
                                value={this.state.name && this.state.name.default}
                                type="text"
                                name="name"
                                placeholder={intl.formatMessage({id: 'app.profile.name'})}
                                onChange={(value) => {
                                    this.setState({name: {default: value}})
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
                                /> <FormattedMessage id="app.profile.name_valid"/></div>}
                                {this.state.name.length === 0 &&
                                <div className="font-size-xs error-message"><FontAwesomeIcon
                                    icon={faTimesCircle}
                                    size="sm"
                                /> <FormattedMessage id="app.profile.name_required"/></div>}
                            </div>}
                            <Inputbox
                                style={inputboxStyle}
                                value={this.state.username}
                                type="text"
                                name="username"
                                placeholder={intl.formatMessage({id: 'app.profile.username'})}
                                onChange={(value) => {
                                    this.setState({username: value, usernameExist: false})
                                }}
                                onBlur={() => {
                                    this.setState({displayUsernameMessage: true})
                                }}
                            />
                            {this.state.displayUsernameMessage && <div className="message-container">
                                {validateUsername(this.state.username) && !this.state.usernameExist &&
                                <div className="font-size-xs success-message"><FontAwesomeIcon
                                    icon={faCheckCircle}
                                    size="sm"
                                /> <FormattedMessage id="app.profile.username_valid"/></div>}
                                {!validateUsername(this.state.username) &&
                                <div className="font-size-xs error-message"><FontAwesomeIcon
                                    icon={faTimesCircle}
                                    size="sm"
                                /> <FormattedMessage id="app.profile.username_invalid"/></div>}
                                {this.state.usernameExist &&
                                <div className="font-size-xs error-message"><FontAwesomeIcon
                                    icon={faTimesCircle}
                                    size="sm"
                                /> <FormattedMessage id="app.profile.username_exists"/></div>}
                            </div>}
                            <Inputbox
                                style={inputboxStyle}
                                value={this.state.email}
                                type="text"
                                name="email"
                                placeholder={intl.formatMessage({id: 'app.profile.email'})}
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
                                /> <FormattedMessage id="app.profile.email_valid"/></div>}
                                {!validateEmail(this.state.email) &&
                                <div className="font-size-xs error-message"><FontAwesomeIcon
                                    icon={faTimesCircle}
                                    size="sm"
                                /> <FormattedMessage id="app.profile.email_invalid"/></div>}
                                {this.state.emailExist && <div className="font-size-xs error-message"><FontAwesomeIcon
                                    icon={faTimesCircle}
                                    size="sm"
                                /> <FormattedMessage id="app.profile.email_exists"/></div>}
                            </div>}
                            <Inputbox
                                style={inputboxStyle}
                                value={this.state.password}
                                type="password"
                                name="password"
                                placeholder={intl.formatMessage({id: 'app.profile.password'})}
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
                                    /> <FormattedMessage id="app.profile.password_valid"/></div> :
                                    <div className="font-size-xs error-message"><FontAwesomeIcon
                                        icon={faTimesCircle}
                                        size="sm"
                                    /> <FormattedMessage id="app.profile.password_longer"/></div>}
                            </div>}
                            <div style={{width: '100%', height: 5}}/>
                            <Buttonbox
                                style={auramazeButtonboxStyle}
                                processing={this.state.auramazeProcessing}
                                onClick={() => {
                                    this.updateProfile(showLoginModal);
                                }}
                            >
                                <div style={{color: '#666666', display: 'inlineBlock', margin: '0 10px'}}>
                                    <img src={auramaze} alt="auramaze"
                                         style={{width: 25, height: 25, marginRight: 10, verticalAlign: 'middle'}}/>
                                    <span
                                        style={{
                                            display: 'inlineBlock',
                                            verticalAlign: 'middle'
                                        }}><FormattedMessage id="app.profile.submit"/></span>
                                </div>
                            </Buttonbox>
                        </div>
                    </Modal>)}
            </ModalContext.Consumer>
        );
    }
}

export default withCookies(injectIntl(ProfileModal));
