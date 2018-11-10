import React, {Component} from 'react';
import Buttonbox from './buttonbox';
import google from '../icons/google.svg';
import facebook from '../icons/facebook.svg';

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
const providerName = {google: 'Google', facebook: 'Facebook'};
const providerLogo = {google: google, facebook: facebook};

class OAuthButtonbox extends Component {
    constructor(props) {
        super(props);
        this.state = {hover: false};
    }

    render() {
        const {provider, socket, signup, processing, onClick, ...props} = this.props;
        return (
            <Buttonbox
                style={oauthButtonboxStyle[provider]}
            >
                <div style={oauthInnerStyle[provider]}>
                    <img src={providerLogo[provider]}
                         style={{width: 20, height: 20, marginRight: 10, verticalAlign: 'middle'}}/>
                    <span style={{
                        display: 'inlineBlock',
                        verticalAlign: 'middle'
                    }}>{signup ? 'Sign up' : 'Log in'} with {providerName[provider]}</span>
                </div>
            </Buttonbox>
        );
    }
}

export default OAuthButtonbox;
