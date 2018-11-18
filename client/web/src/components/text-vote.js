import React, {Component} from 'react';
import {withCookies} from 'react-cookie';
import request from "request";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faThumbsUp as faThumbsUpSolid} from '@fortawesome/free-solid-svg-icons';
import {faThumbsDown as faThumbsDownSolid} from '@fortawesome/free-solid-svg-icons';
import {faThumbsUp as faThumbsUpRegular} from '@fortawesome/free-regular-svg-icons';
import {faThumbsDown as faThumbsDownRegular} from '@fortawesome/free-regular-svg-icons';
import {ModalContext} from '../app';
import {VoteContext} from '../app';
import {API_ENDPOINT} from "../common";
import {removeCookies} from "../utils";
import './text-vote.css';

class TextVote extends Component {
    constructor(props) {
        super(props);
        this.handleVote = this.handleVote.bind(this);
    }

    handleVote(type, vote, updateVote, showLoginModal) {
        const {itemType, itemId, textType, textId, cookies} = this.props;
        const status = vote[textId] && vote[textId].status || 0;
        let up = vote[textId] && vote[textId].up || 0;
        let down = vote[textId] && vote[textId].down || 0;

        if ((status === 1 && type === 'up') || (status === -1 && type === 'down')) {
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
                    if (type === 'up') {
                        if (status !== 1) {
                            up++;
                        }
                        if (status === -1) {
                            down--;
                        }
                    } else {
                        if (status !== -1) {
                            down++;
                        }
                        if (status === 1) {
                            up--;
                        }
                    }
                    updateVote(Object.assign(vote, {[textId]: {up: up, down: down, status: type === 'up' ? 1 : -1}}));
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
        const {textId} = this.props;
        return (<ModalContext.Consumer>
                {({showLoginModal}) => (
                    <VoteContext.Consumer>
                        {({vote, updateVote}) => (
                            <div className="text-vote">
                                <FontAwesomeIcon
                                    style={{cursor: vote[textId] && vote[textId].status === 1 ? 'default' : 'pointer'}}
                                    onClick={() => {
                                        this.handleVote('up', vote, updateVote, showLoginModal);
                                    }}
                                    className="text-vote-icon"
                                    icon={vote[textId] && vote[textId].status === 1 ? faThumbsUpSolid : faThumbsUpRegular}
                                    size="lg"
                                />
                                <span>{vote[textId] && vote[textId].up || 0}</span>
                                <FontAwesomeIcon
                                    style={{cursor: vote[textId] && vote[textId].status === -1 ? 'default' : 'pointer'}}
                                    onClick={() => {
                                        this.handleVote('down', vote, updateVote, showLoginModal);
                                    }}
                                    className="text-vote-icon"
                                    icon={vote[textId] && vote[textId].status === -1 ? faThumbsDownSolid : faThumbsDownRegular}
                                    size="lg"
                                />
                                <span>{vote[textId] && vote[textId].down || 0}</span>
                            </div>)}
                    </VoteContext.Consumer>)}
            </ModalContext.Consumer>
        );
    }
}

export default withCookies(TextVote);
