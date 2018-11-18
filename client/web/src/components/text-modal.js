import React, {Component} from 'react';
import request from 'request';
import {withCookies} from 'react-cookie';
import {Link, withRouter} from 'react-router-dom';
import {Scrollbars} from 'react-custom-scrollbars';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeadphonesAlt} from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-stars";
import {convertFromRaw, Editor, EditorState} from "draft-js";
import Modal from './modal';
import {WindowContext, VoteContext} from "../app";
import {API_ENDPOINT} from "../common";
import {unlockBody} from "../utils";
import TextVote from "./text-vote";
import {LanguageContext} from '../app';
import {getLocaleValue} from '../utils';
import './text-modal.css';

class TextModal extends Component {
    constructor(props) {
        super(props);
        this.state = {show: false, text: {}, audio: false};
    }

    componentDidMount() {
        const {itemType, itemId, textType, textId} = this.props.match.params;
        const {vote, updateVote} = this.props;

        const token = this.props.cookies.get('token');

        request.get({
            url: `${API_ENDPOINT}/${itemType}/${itemId}/${textType}/${textId}`,
            headers: token && {
                'Authorization': `Bearer ${token}`
            },
            json: true
        }, (error, response, text) => {
            if (response && response.statusCode === 200) {
                const newVote = (({up, down, status}) => ({up, down, status}))(text);
                updateVote(Object.assign(vote, {[text.id]: newVote}));
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
            <LanguageContext.Consumer>
                {({language}) => (
                    <WindowContext.Consumer>
                        {({windowHeight}) => (
                            <Modal {...props} show={this.state.show} handleClose={() => {
                                history.push(`/${itemType}/${itemId}`);
                            }} style={{
                                width: '95%',
                                maxWidth: 800
                            }}>
                                <div className="text-modal">
                                    <div className="text-modal-title">
                                        <Link to={`/artizen/${author_username || author_id}`}>
                                            {author_avatar ?
                                                <img src={author_avatar} alt="avatar" className="text-modal-avatar"/> :
                                                <div className="text-modal-avatar"
                                                     style={{backgroundColor: '#cdcdcd'}}/>}
                                        </Link>
                                        <span className="text-modal-name">{getLocaleValue(author_name, language)}</span>
                                        {this.state.audio && <div className="text-modal-audio">
                                            <FontAwesomeIcon icon={faHeadphonesAlt} size="lg"/>
                                        </div>}
                                    </div>
                                    <div className="text-modal-content">
                                        <Scrollbars autoHeight autoHeightMax={windowHeight - 400}>
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
                                        </Scrollbars>
                                    </div>
                                    <TextVote itemType={itemType} itemId={itemId} textType={textType} textId={textId}
                                              up={up}
                                              down={down} status={status}/>
                                </div>
                            </Modal>)}
                    </WindowContext.Consumer>)}
            </LanguageContext.Consumer>
        );
    }
}

export default withRouter(withCookies(React.forwardRef((props, ref) => (
    <VoteContext.Consumer>
        {({vote, updateVote}) => <TextModal {...props} vote={vote} updateVote={updateVote} ref={ref}/>}
    </VoteContext.Consumer>)
)));
