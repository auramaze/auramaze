import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {withCookies} from 'react-cookie';
import request from "request";
import ReactStars from 'react-stars';
import {Editor, EditorState, convertFromRaw} from 'draft-js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faThumbsUp as faThumbsUpSolid} from '@fortawesome/free-solid-svg-icons';
import {faThumbsDown as faThumbsDownSolid} from '@fortawesome/free-solid-svg-icons';
import {faThumbsUp as faThumbsUpRegular} from '@fortawesome/free-regular-svg-icons';
import {faThumbsDown as faThumbsDownRegular} from '@fortawesome/free-regular-svg-icons';
import {ModalContext} from '../app';
import {API_ENDPOINT} from "../common";
import {removeCookies} from "../utils";
import './text-vote.css';

class TextVote extends Component {
    constructor(props) {
        super(props);
        this.state = {up: props.up, down: props.down, status: props.status};
        this.handleVote = this.handleVote.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {up, down, status} = this.props;
        if (up !== prevProps.up || down !== prevProps.down || status !== prevProps.status) {
            console.log('update');
            this.setState({up, down, status});
        }
    }

    handleVote(type, showLoginModal) {
        const {itemType, itemId, textType, textId, cookies} = this.props;
        const {status} = this.state;
        if (status === 1 && type === 'up' || status === -1 && type === 'down') {
            return;
        }

        const token = cookies.get('token');
        if (token) {
            request.post({
                url: `${API_ENDPOINT}/${itemType}/${itemId}/${textType}/${textId}/vote`,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: {type},
                json: true
            }, (error, response, body) => {
                if (response && response.statusCode === 200) {
                    let newUp = this.state.up;
                    let newDown = this.state.down;
                    if (type === 'up') {
                        if (this.state.status !== 1) {
                            newUp++;
                        }
                        if (this.state.status === -1) {
                            newDown--;
                        }
                    } else {
                        if (this.state.status !== -1) {
                            newDown++;
                        }
                        if (this.state.status === 1) {
                            newUp--;
                        }
                    }
                    this.setState({
                        status: type === 'up' ? 1 : -1,
                        up: newUp,
                        down: newDown
                    });
                } else if (response.statusCode === 401) {
                    removeCookies(cookies);
                    showLoginModal();
                }
            });
        } else {
            showLoginModal();
        }
    }

    render() {
        const {cookies} = this.props;
        return (<ModalContext.Consumer>
                {({showLoginModal}) => (
                    <div className="text-vote">
                        <FontAwesomeIcon
                            style={{cursor: this.state.status === 1 ? 'default' : 'pointer'}}
                            onClick={() => {
                                this.handleVote('up', showLoginModal);
                            }}
                            className="text-vote-icon"
                            icon={this.state.status === 1 ? faThumbsUpSolid : faThumbsUpRegular}
                            size="lg"
                        />
                        <span>{this.state.up}</span>
                        <FontAwesomeIcon
                            style={{cursor: this.state.status === -1 ? 'default' : 'pointer'}}
                            onClick={() => {
                                this.handleVote('down', showLoginModal);
                            }}
                            className="text-vote-icon"
                            icon={this.state.status === -1 ? faThumbsDownSolid : faThumbsDownRegular}
                            size="lg"
                        />
                        <span>{this.state.down}</span>
                    </div>)}
            </ModalContext.Consumer>
        );
    }
}

export default withCookies(TextVote);
