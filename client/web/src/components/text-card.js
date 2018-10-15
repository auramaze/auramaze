import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faThumbsUp as faThumbsUpSolid} from '@fortawesome/free-solid-svg-icons';
import {faThumbsDown as faThumbsDownSolid} from '@fortawesome/free-solid-svg-icons';
import {faThumbsUp as faThumbsUpRegular} from '@fortawesome/free-regular-svg-icons';
import {faThumbsDown as faThumbsDownRegular} from '@fortawesome/free-regular-svg-icons';
import './text-card.css';
import '../common.css';

class TextCard extends Component {
    constructor(props) {
        super(props);
        this.state = {contentHeight: 0};
        this.content = React.createRef();
    }

    componentDidMount() {
        this.setState({contentHeight: this.content.current.offsetHeight});
    }

    render() {
        const {authorId, authorUsername, authorName, avatar, itemType, itemId, itemUsername, textType, textId, content, likes, dislikes, ...props} = this.props;
        return (
            <div {...props} className="text-card card-shadow">
                <Link to={`/${itemType}/${itemUsername || itemId}/${textType}/${textId}`}>
                    <div className="text-card-title">
                        {avatar ? <img src={avatar} alt="avatar" className="text-card-avatar"/> :
                            <div className="text-card-avatar" style={{backgroundColor: '#cdcdcd'}}/>}
                        <span className="text-card-name">{authorName}</span>
                    </div>
                    <div className="text-card-content">
                        <span ref={this.content}>{content}</span>
                        {this.state.contentHeight > 150 && <div className="text-card-mask-bottom"/>}
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
                </Link>
            </div>
        );
    }
}

export default TextCard;
