import React, {Component} from 'react';
import {withCookies} from 'react-cookie';
import {FormattedMessage} from 'react-intl';
import Buttonbox from './buttonbox';
import google from '../icons/google.svg';
import facebook from '../icons/facebook.svg';
import {API_ENDPOINT} from "../common";

const buttonboxStyle = {
    margin: '20px 0',
    width: '100%',
    height: 50,
    borderRadius: 5,
    whiteSpace: 'nowrap'
};
const oauthButtonboxStyle = {
    google: Object.assign({
        backgroundColor: '#ffffff',
        color: '#484848',
        border: 'solid 2px #484848'
    }, buttonboxStyle),
    facebook: Object.assign({
        backgroundColor: '#3b5998',
        color: '#ffffff'
    }, buttonboxStyle)
};
const oauthInnerStyle = {
    google: {color: '#484848', display: 'inlineBlock', margin: '0 10px'},
    facebook: {color: '#ffffff', display: 'inlineBlock', margin: '0 10px'}
};

const providerLogo = {google: google, facebook: facebook};

class OAuthButtonbox extends Component {
    constructor(props) {
        super(props);
        this.state = {processing: false};
    }

    componentDidMount() {
        const {socket, provider} = this.props;

        socket.on(provider, user => {
            this.popup.close();
            this.onAuth(user);
        })
    }

    checkPopup() {
        const check = setInterval(() => {
            const {popup} = this;
            if (!popup || popup.closed || popup.closed === undefined) {
                clearInterval(check);
                this.setState({processing: false})
            }
        }, 1000)
    }

    openPopup() {
        const {provider, socket} = this.props;
        const width = 600, height = 600;
        const left = (window.innerWidth / 2) - (width / 2);
        const top = (window.innerHeight / 2) - (height / 2);
        const url = `${API_ENDPOINT}/auth/${provider}?socketId=${socket.id}`;

        return window.open(url, '',
            `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
        )
    }

    startAuth = () => {
        if (!this.state.processing) {
            this.popup = this.openPopup();
            this.checkPopup();
            this.setState({processing: true})
        }
    };

    onAuth(user) {
        const {cookies} = this.props;
        if (user.id) {
            cookies.set('id', user.id, {path: '/'});
        } else {
            cookies.remove('id', {path: '/'});
        }
        if (user.username) {
            cookies.set('username', user.username, {path: '/'});
        } else {
            cookies.remove('username', {path: '/'});
        }
        if (user.token) {
            cookies.set('token', user.token, {path: '/'});
        } else {
            cookies.remove('token', {path: '/'});
        }
    }

    render() {
        const {provider, signup} = this.props;
        return (
            <Buttonbox
                style={oauthButtonboxStyle[provider]}
                processing={this.state.processing}
                onClick={this.startAuth}
            >
                <div style={oauthInnerStyle[provider]}>
                    <img src={providerLogo[provider]} alt={provider}
                         style={{width: 20, height: 20, marginRight: 10, verticalAlign: 'middle'}}/>
                    <span style={{
                        display: 'inlineBlock',
                        verticalAlign: 'middle'
                    }}><FormattedMessage id={`app.${signup ? 'signup' : 'login'}.${provider}`}/></span>
                </div>
            </Buttonbox>
        );
    }
}

export default withCookies(OAuthButtonbox);
