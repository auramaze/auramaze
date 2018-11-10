import React, {Component} from 'react';
import request from 'request';
import {withCookies, Cookies} from "react-cookie";
import io from 'socket.io-client'
import Modal from './modal';
import Inputbox from './inputbox';
import Buttonbox from './buttonbox';
import auramaze from '../static/logo-white-frame.svg';
import './signup-modal.css';
import {AuthContext} from "../app";
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

class SignupModal extends Component {
    constructor(props) {
        super(props);
        this.state = {name: '', email: '', password: '', auramazeProcessing: false};
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
                this.setState({name: '', email: '', password: ''})
            }
            this.setState({auramazeProcessing: false});
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
                    />
                    <Inputbox
                        style={inputboxStyle}
                        value={this.state.email}
                        type="text"
                        name="email"
                        placeholder="Email"
                        onChange={(value) => {
                            this.setState({email: value})
                        }}
                    />
                    <Inputbox
                        style={inputboxStyle}
                        value={this.state.password}
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(value) => {
                            this.setState({password: value})
                        }}
                    />
                    <div style={{width: '100%', height: 5}}/>
                    <Buttonbox
                        style={auramazeButtonboxStyle}
                        processing={this.state.auramazeProcessing}
                        onClick={() => {
                            this.signup();
                        }}
                    >
                        <div style={{color: '#666666', display: 'inlineBlock', margin: '0 10px'}}>
                            <img src={auramaze}
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
