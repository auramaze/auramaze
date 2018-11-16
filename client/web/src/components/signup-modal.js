import React, {Component} from 'react';
import request from 'request';
import {withCookies} from "react-cookie";
import io from 'socket.io-client'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckCircle} from '@fortawesome/free-regular-svg-icons';
import {faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import Modal from './modal';
import Inputbox from './inputbox';
import Buttonbox from './buttonbox';
import auramaze from '../static/logo-white-frame.svg';
import './signup-modal.css';
import {API_ENDPOINT, API_URL} from "../common";
import OAuthButtonbox from "./oauth-buttonbox";

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

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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

    render() {
        return (
            <Modal {...this.props} style={{
                width: '95%',
                maxWidth: 800
            }}>
                <div className="signup-modal-content">
                    <p className="font-size-xl">Sign up</p>
                    <Inputbox
                        style={inputboxStyle}
                        value={this.state.name}
                        type="text"
                        name="name"
                        placeholder="Name"
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
                        /> Name is valid</div>}
                        {this.state.name.length === 0 &&
                        <div className="font-size-xs error-message"><FontAwesomeIcon
                            icon={faTimesCircle}
                            size="sm"
                        /> Name is required</div>}
                    </div>}
                    <Inputbox
                        style={inputboxStyle}
                        value={this.state.email}
                        type="text"
                        name="email"
                        placeholder="Email"
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
                        /> Email is valid</div>}
                        {!validateEmail(this.state.email) &&
                        <div className="font-size-xs error-message"><FontAwesomeIcon
                            icon={faTimesCircle}
                            size="sm"
                        /> Email is invalid</div>}
                        {this.state.emailExist && <div className="font-size-xs error-message"><FontAwesomeIcon
                            icon={faTimesCircle}
                            size="sm"
                        /> Email already exists</div>}
                    </div>}
                    <Inputbox
                        style={inputboxStyle}
                        value={this.state.password}
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(value) => {
                            this.setState({password: value})
                        }}
                        onBlur={() => {
                            this.setState({displayPasswordMessage: true})
                        }}
                    />
                    {this.state.displayPasswordMessage && <div className="message-container">
                        {this.state.password.length >= 4 ?
                            <div className="font-size-xs success-message"><FontAwesomeIcon
                                icon={faCheckCircle}
                                size="sm"
                            /> Password is valid</div> :
                            <div className="font-size-xs error-message"><FontAwesomeIcon
                                icon={faTimesCircle}
                                size="sm"
                            /> Password should be longer</div>}
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
                                }}>Create AuraMaze account</span>
                        </div>
                    </Buttonbox>
                    <div style={{width: '100%', height: 0, borderBottom: 'solid 1px #666666'}}/>
                    <OAuthButtonbox signup provider="google" socket={socket}/>
                    <OAuthButtonbox signup provider="facebook" socket={socket}/>
                </div>
            </Modal>
        );
    }
}

export default withCookies(SignupModal);
