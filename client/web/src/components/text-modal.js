import React, {Component} from 'react';
import request from 'request';
import {withCookies, Cookies} from 'react-cookie';
import Modal from './modal';
import Inputbox from './inputbox';
import './text-modal.css';
import {AuthContext} from "../app";
import {API_URL} from "../common";

class TextModal extends Component {
    constructor(props) {
        super(props);
        this.state = {id: '', password: '', auramazeProcessing: false};
    }

    render() {
        return (
            <Modal {...this.props} style={{
                width: '95%',
                maxWidth: 800
            }}>
                <div className="text-modal-content">
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
                </div>
            </Modal>
        );
    }
}

export default withCookies(TextModal);
