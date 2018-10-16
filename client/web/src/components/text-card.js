import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReactStars from 'react-stars';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faThumbsUp as faThumbsUpSolid} from '@fortawesome/free-solid-svg-icons';
import {faThumbsDown as faThumbsDownSolid} from '@fortawesome/free-solid-svg-icons';
import {faThumbsUp as faThumbsUpRegular} from '@fortawesome/free-regular-svg-icons';
import {faThumbsDown as faThumbsDownRegular} from '@fortawesome/free-regular-svg-icons';
import {faHeadphonesAlt} from '@fortawesome/free-solid-svg-icons';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import './text-card.css';

class TextCard extends Component {
    constructor(props) {
        super(props);
        this.state = {contentHeight: 0, audio: false};
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
        const {authorId, authorUsername, authorName, avatar, itemType, itemId, itemUsername, textType, textId, rating, content, likes, dislikes, ...props} = this.props;
        return (
            <div {...props} className="text-card card-shadow">
                <div className="text-card-title">
                    <Link to={`/artizen/${authorUsername || authorId}`}>
                        {avatar ? <img src={avatar} alt="avatar" className="text-card-avatar"/> :
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
                        {this.props.textType === 'review' && this.props.rating &&
                        <div className="react-stars-container">
                            <ReactStars
                                count={5}
                                value={rating}
                                size={24}
                                edit={false}
                                color2={'#ffd700'}
                            />
                        </div>
                        }
                        {content}
                    </div>
                    {this.state.contentHeight > 200 && <div className="text-card-mask-bottom"/>}
                </div>
                <div className="text-card-vote">
                    <FontAwesomeIcon
                        className="text-card-vote-icon"
                        icon={this.props.status === 1 ? faThumbsUpSolid : faThumbsUpRegular}
                        size="lg"
                    />
                    <span>{likes}</span>
                    <FontAwesomeIcon
                        className="text-card-vote-icon"
                        icon={this.props.status === -1 ? faThumbsDownSolid : faThumbsDownRegular}
                        size="lg"
                    />
                    <span>{dislikes}</span>
                </div>
            </div>
        );
    }
}

export default TextCard;
