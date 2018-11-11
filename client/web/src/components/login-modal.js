import React, {Component} from 'react';
import request from 'request';
import {withCookies, Cookies} from 'react-cookie';
import io from 'socket.io-client'
import Modal from './modal';
import Inputbox from './inputbox';
import Buttonbox from './buttonbox';
import OAuthButtonbox from './oauth-buttonbox';
import auramaze from '../static/logo-white-frame.svg';
import './login-modal.css';
import {AuthContext} from "../app";
import {API_URL} from "../common";
import {API_ENDPOINT} from "../common";

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

class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {id: '', password: '', auramazeProcessing: false};
        this.login = this.login.bind(this);
    }

    login() {
        this.setState({auramazeProcessing: true});
        request.post({
            url: `${API_ENDPOINT}/auth/login`,
            body: {id: this.state.id, password: this.state.password},
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
            } else {
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
                <div className="login-modal-content">
                    <p className="font-size-xl">Log in</p>
                    <Inputbox
                        style={inputboxStyle}
                        value={this.state.id}
                        type="text"
                        name="id"
                        placeholder="Email or username"
                        onChange={(value) => {
                            this.setState({id: value})
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
                            this.login();
                        }}
                    >
                        <div style={{color: '#666666', display: 'inlineBlock', margin: '0 10px'}}>
                            <img src={auramaze}
                                 style={{width: 25, height: 25, marginRight: 10, verticalAlign: 'middle'}}/>
                            <span
                                style={{
                                    display: 'inlineBlock',
                                    verticalAlign: 'middle'
                                }}>Log in with AuraMaze</span>
                        </div>
                    </Buttonbox>
                    <div style={{width: '100%', height: 0, borderBottom: 'solid 1px #666666'}}/>
                    <OAuthButtonbox login provider="google" socket={socket}/>
                    <OAuthButtonbox login provider="facebook" socket={socket}/>
                </div>
            </Modal>
        );
    }
}

export default withCookies(LoginModal);
