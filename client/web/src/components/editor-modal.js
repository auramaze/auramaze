import React, {Component} from 'react';
import request from 'request';
import {withCookies} from 'react-cookie';
import {Link, withRouter} from 'react-router-dom';
import {Scrollbars} from 'react-custom-scrollbars';
import ReactStars from "react-stars";
import {convertFromRaw, Editor, EditorState} from "draft-js";
import Modal from './modal';
import {AuthContext, WindowContext} from "../app";
import {API_ENDPOINT, API_URL} from "../common";
import {unlockBody} from "../utils";
import RichEditor from './rich-editor';
import Buttonbox from './buttonbox'
import './editor-modal.css';
import auramaze from "../static/logo-white-frame.svg";

const cancelButtonboxStyle = {
    display: 'inline-block',
    width: '30%',
    height: 40,
    borderRadius: 3,
    whiteSpace: 'nowrap',
    backgroundColor: '#ffffff',
    color: '#666666',
    border: 'solid 2px #666666'
};

const submitButtonboxStyle = {
    display: 'inline-block',
    width: '65%',
    height: 40,
    borderRadius: 3,
    whiteSpace: 'nowrap',
    backgroundColor: '#cdcdcd',
    color: '#484848'
};

class EditorModal extends Component {
    constructor(props) {
        super(props);
        this.state = {show: true, text: {}, audio: false};
    }

    componentDidMount() {
        const {itemType, itemId, textType, textId} = this.props.match.params;

        const token = this.props.cookies.get('token');

        request.get({
            url: `${API_ENDPOINT}/${itemType}/${itemId}/${textType}/${textId}`,
            headers: token && {
                'Authorization': `Bearer ${token}`
            },
            json: true
        }, (error, response, text) => {
            if (response && response.statusCode === 200) {
                this.setState({text: text, show: true});
            }
        });
    }

    componentWillUnmount() {
        unlockBody();
        this.setState({show: false});
    }

    render() {
        const {history, ...props} = this.props;
        const {itemType, itemId, textType, textId} = this.props.match.params;
        const {author_id, author_username, author_name, author_avatar, rating, content, up, down, status} = this.state.text;

        return (
            <WindowContext.Consumer>
                {({windowHeight}) => (
                    <Modal
                        {...props}
                        show={this.state.show}
                        hideCloseButton
                        handleClose={() => {
                            history.push(`/${itemType}/${itemId}`);
                        }}
                        style={{
                            width: '95%',
                            maxWidth: 800
                        }}
                    >
                        <div className="editor-modal">
                            <RichEditor placeholder={`Write an introduction to`}/>
                            <div className="editor-modal-footer">
                                <Buttonbox
                                    style={cancelButtonboxStyle}
                                    onClick={() => {
                                    }}
                                >
                                    <span className="font-size-xs">Cancel</span>
                                </Buttonbox>
                                <div style={{display: 'inline-block', width: '5%'}}/>
                                <Buttonbox
                                    style={submitButtonboxStyle}
                                    onClick={() => {
                                    }}
                                >
                                    <span className="font-size-xs">Submit</span>
                                </Buttonbox>
                            </div>
                        </div>
                    </Modal>)}
            </WindowContext.Consumer>
        );
    }
}

export default withRouter(withCookies(EditorModal));
