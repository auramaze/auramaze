import React, {Component} from 'react';
import request from 'request';
import Modal from './modal';
import Inputbox from './inputbox';
import Buttonbox from './buttonbox';
import auramaze from '../static/logo-white-frame.svg';
import google from '../icons/google.svg';
import facebook from '../icons/facebook.svg';
import './login-modal.css';
import {AuthContext} from "../app";
import {API_ENDPOINT} from "../common";

const inputboxStyle = {margin: '20px 0', width: '100%'};
const buttonboxStyle = {
    margin: '20px 0',
    width: '100%',
    height: 50,
    borderRadius: 5,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
};
const auramazeButtonboxStyle = Object.assign({
    backgroundColor: '#cdcdcd',
    color: '#666666'
}, buttonboxStyle);
const gmailButtonboxStyle = Object.assign({
    backgroundColor: '#ffffff',
    color: '#484848',
    border: 'solid 2px #484848'
}, buttonboxStyle);
const facebookButtonboxStyle = Object.assign({
    backgroundColor: '#3b5998',
    color: '#ffffff'
}, buttonboxStyle);

class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {name: '', id: '', password: '', auramazeDisabled: false};
        this.login = this.login.bind(this);
    }

    login(createAuth) {
        this.setState({auramazeDisabled: true});
        request.post({
            url: `${API_ENDPOINT}/auth/login`,
            body: {id: this.state.id, password: this.state.password},
            json: true
        }, (error, response, body) => {
            if (response && response.statusCode === 200) {
                createAuth(body.id, body.username, body.token);
            }
        });
    }

    render() {
        return (
            <AuthContext.Consumer>
                {({auth, createAuth}) => (
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
                                disabled={this.state.auramazeDisabled}
                                onClick={() => {
                                    this.login(createAuth);
                                }}
                            >
                                <div style={{color: '#666666', display: 'inlineBlock'}}>
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
                            <Buttonbox
                                style={gmailButtonboxStyle}
                            >
                                <div style={{color: '#484848', display: 'inlineBlock'}}>
                                    <img src={google}
                                         style={{width: 20, height: 20, marginRight: 10, verticalAlign: 'middle'}}/>
                                    <span style={{
                                        display: 'inlineBlock',
                                        verticalAlign: 'middle'
                                    }}>Log in with Google</span>
                                </div>
                            </Buttonbox>
                            <Buttonbox
                                style={facebookButtonboxStyle}
                            >
                                <div style={{color: '#ffffff', display: 'inlineBlock'}}>
                                    <img src={facebook}
                                         style={{width: 20, height: 20, marginRight: 10, verticalAlign: 'middle'}}/>
                                    <span style={{
                                        display: 'inlineBlock',
                                        verticalAlign: 'middle'
                                    }}>Log in with Facebook</span>
                                </div>
                            </Buttonbox>
                        </div>
                    </Modal>
                )}
            </AuthContext.Consumer>
        );
    }
}

export default LoginModal;
