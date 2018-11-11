import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import request from "request";
import ReactStars from 'react-stars';
import {Editor, EditorState, convertFromRaw} from 'draft-js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeadphonesAlt} from '@fortawesome/free-solid-svg-icons';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import TextVote from './text-vote';
import {API_ENDPOINT} from "../common";
import './text-card.css';

class TextCard extends Component {
    constructor(props) {
        super(props);
        this.state = {contentHeight: 0, audio: false, up: props.up, down: props.down, status: props.status};
        this.content = React.createRef();
        this.updateContentHeight = this.updateContentHeight.bind(this);
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

    render() {
        const {authorId, authorUsername, authorName, authorAvatar, itemType, itemId, itemUsername, textType, textId, rating, content, up, down, status, ...props} = this.props;
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
                <TextVote itemType={itemType} itemId={itemId} textType={textType} textId={textId} up={up}
                          down={down} status={status}/>
            </div>
        );
    }
}

export default TextCard;
