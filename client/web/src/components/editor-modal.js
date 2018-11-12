import React, {Component} from 'react';
import request from 'request';
import {withCookies} from 'react-cookie';
import {Scrollbars} from 'react-custom-scrollbars';
import ReactStars from "react-stars";
import {convertToRaw, EditorState} from "draft-js";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import Modal from './modal';
import {AuthContext, ModalContext, WindowContext} from "../app";
import {API_ENDPOINT, API_URL} from "../common";
import {removeCookies, unlockBody} from "../utils";
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
    border: 'solid 1px #666666'
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
        this.state = {editorState: EditorState.createEmpty()};
    }

    handleSubmit = (showLoginModal) => {
        const {itemType, itemId, textType, handleClose, cookies} = this.props;
        const token = cookies.get('token');
        if (token) {
            const {editorState} = this.state;
            request.post({
                url: `${API_ENDPOINT}/${itemType}/${itemId}/${textType}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: {content: convertToRaw(editorState.getCurrentContent())},
                json: true
            }, (error, response, body) => {
                if (response && response.statusCode === 200) {
                    handleClose();
                    window.location.reload();
                } else if (response.statusCode === 401) {
                    removeCookies(cookies);
                    showLoginModal();
                }
            });
        } else {
            showLoginModal();
        }
    };

    render() {
        const {show, handleClose, itemName, textType, ...props} = this.props;
        const {editorState} = this.state;

        return (<ModalContext.Consumer>
                {({showLoginModal}) => (
                    <div>
                        <Modal
                            {...props}
                            show={show}
                            handleClose={handleClose}
                            hideCloseButton
                            style={{
                                width: '95%',
                                maxWidth: 800
                            }}
                        >
                            <div className="editor-modal">
                                <RichEditor
                                    placeholder={`Write ${textType === 'introduction' ? 'an' : 'a'} ${textType}${itemName && ` ${textType === 'introduction' ? 'to' : 'for'} "${itemName.default}"`}...`}
                                    editorState={editorState}
                                    onChange={(editorState) => {
                                        this.setState({editorState});
                                    }}
                                />
                                <div className="editor-modal-footer">
                                    <Buttonbox
                                        style={cancelButtonboxStyle}
                                        onClick={handleClose}
                                    >
                                        <span className="font-size-xs">Cancel</span>
                                    </Buttonbox>
                                    <div style={{display: 'inline-block', width: '5%'}}/>
                                    <Buttonbox
                                        style={submitButtonboxStyle}
                                        onClick={() => {
                                            this.handleSubmit(showLoginModal)
                                        }}
                                    >
                                        <span className="font-size-xs">Submit</span>
                                    </Buttonbox>
                                </div>
                            </div>
                        </Modal>
                    </div>)}
            </ModalContext.Consumer>
        );
    }
}

export default withCookies(EditorModal);
