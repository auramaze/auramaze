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
import {faHeadphonesAlt} from '@fortawesome/free-solid-svg-icons';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import './text-card.css';
import {API_ENDPOINT} from "../common";

class TextCard extends Component {
    constructor(props) {
        super(props);
        this.state = {contentHeight: 0, audio: false, up: props.up, down: props.down, status: props.status};
        this.content = React.createRef();
        this.updateContentHeight = this.updateContentHeight.bind(this);
        this.handleVote = this.handleVote.bind(this);
    }

    componentDidMount() {
        this.updateContentHeight();
        window.addEventListener('resize', this.updateContentHeight);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateContentHeight);
    }

    updateContentHeight() {
        this.setState({
            contentHeight: this.content.current.clientHeight,
        });
    }

    handleVote(type) {
        const {itemType, itemId, textType, textId, cookies} = this.props;
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
                }
            });
        }
    }

    render() {
        const {authorId, authorUsername, authorName, authorAvatar, itemType, itemId, itemUsername, textType, textId, rating, content, ...props} = this.props;
        return (
            <div {...props} className="text-card card-shadow">
                <div className="text-card-title">
                    <Link to={`/artizen/${authorUsername || authorId}`}>
                        {authorAvatar ? <img src={authorAvatar} alt="avatar" className="text-card-avatar"/> :
                            <div className="text-card-avatar" style={{backgroundColor: '#cdcdcd'}}/>}
                    </Link>
                    <span className="text-card-name">{authorName}</span>
                    <Link to={`/${itemType}/${itemUsername || itemId}/${textType}/${textId}`}>
                        <div className="text-card-more">
                            <FontAwesomeIcon icon={faEllipsisV} size="lg"/>
                        </div>
                    </Link>
                    {this.state.audio && <div className="text-card-audio">
                        <FontAwesomeIcon icon={faHeadphonesAlt} size="lg"/>
                    </div>}
                </div>
                <div className="text-card-content">
                    <div ref={this.content}>
                        {textType === 'review' && rating &&
                        <div className="react-stars-container">
                            <ReactStars
                                count={5}
                                value={rating}
                                size={18}
                                edit={false}
                                color2={'#ffd700'}
                            />
                        </div>
                        }
                        {content && <Editor
                            editorState={EditorState.createWithContent(convertFromRaw(content))}
                            readOnly
                        />}
                    </div>
                    {this.state.contentHeight > 200 && <div className="text-card-mask-bottom"/>}
                </div>
                <div className="text-card-vote">
                    <FontAwesomeIcon
                        style={{cursor: this.state.status === 1 ? 'default' : 'pointer'}}
                        onClick={() => {
                            if (this.state.status !== 1) {
                                this.handleVote('up');
                            }
                        }}
                        className="text-card-vote-icon"
                        icon={this.state.status === 1 ? faThumbsUpSolid : faThumbsUpRegular}
                        size="lg"
                    />
                    <span>{this.state.up}</span>
                    <FontAwesomeIcon
                        style={{cursor: this.state.status === -1 ? 'default' : 'pointer'}}
                        onClick={() => {
                            if (this.state.status !== -1) {
                                this.handleVote('down');
                            }
                        }}
                        className="text-card-vote-icon"
                        icon={this.state.status === -1 ? faThumbsDownSolid : faThumbsDownRegular}
                        size="lg"
                    />
                    <span>{this.state.down}</span>
                </div>
            </div>
        );
    }
}

export default withCookies(TextCard);
