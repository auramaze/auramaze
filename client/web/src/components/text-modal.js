import React, {Component} from 'react';
import request from 'request';
import {withCookies} from 'react-cookie';
import {Link, withRouter} from 'react-router-dom';
import {Scrollbars} from 'react-custom-scrollbars';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisV, faHeadphonesAlt} from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-stars";
import {convertFromRaw, Editor, EditorState} from "draft-js";
import Modal from './modal';
import Inputbox from './inputbox';
import './text-modal.css';
import {AuthContext, WindowContext} from "../app";
import {API_URL} from "../common";
import {unlockBody} from "../utils";
import TextVote from "./text-vote";
import Searchbox from "./searchbox";

class TextModal extends Component {
    constructor(props) {
        super(props);
        this.state = {show: false, audio: false};
    }

    componentDidMount() {
        this.setState({show: true});
    }

    componentWillUnmount() {
        unlockBody();
        this.setState({show: false});
    }

    render() {
        const {history, ...props} = this.props;
        const {itemType, itemId, textType, textId} = this.props.match.params;

        const authorUsername = 'umma';
        const authorName = 'UMMA';
        const authorId = 100000015;
        const authorAvatar = 'https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/umma.jpg';
        const rating = 5;
        const content = {
            "blocks": [{
                "key": "46gsu",
                "data": {},
                "text": "Johan Barthold Jongkind\nThe Netherlands, 1819–1891\nAlong the Quays, Honfleur (Sur les quais à Honfleur)\n1864\nGraphite and watercolor on white wove paper\nUniversity of Michigan Museum of Art, Gift of Mrs. Edgar A. Kahn, 2002/2.115\nThe older painter Eugène Isabey encouraged Jongkind to paint in Normandy, as Isabey himself had done for years. Together, Jongkind, Boudin, and Monet spent considerable time together in the areas of Honfleur and Trouville during the mid-1860s.\nThis drawing of the quays in the inner harbor at Honfleur depicts a scene very similar to the canvas of nearly the identical view dating two years later. Both views at Honfleur focus on the expanse of the quay and the labor of workers attending to the vessels. The cropped view of ships at their docks is found in photographs of ships at their berths by Le Secq.\n(Normandy show, 2010)",
                "type": "unstyled",
                "depth": 0,
                "entityRanges": [],
                "inlineStyleRanges": []
            }], "entityMap": {}
        };
        const up = 3;
        const down = 2;
        const status = -1;

        return (
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
                                <Link to={`/artizen/${authorUsername || authorId}`}>
                                    {authorAvatar ?
                                        <img src={authorAvatar} alt="avatar" className="text-modal-avatar"/> :
                                        <div className="text-modal-avatar" style={{backgroundColor: '#cdcdcd'}}/>}
                                </Link>
                                <span className="text-modal-name">{authorName}</span>
                                {this.state.audio && <div className="text-modal-audio">
                                    <FontAwesomeIcon icon={faHeadphonesAlt} size="lg"/>
                                </div>}
                            </div>
                            <div className="text-modal-content">
                                <Scrollbars autoHeight autoHeightMax={windowHeight - 200}>
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
                            <TextVote itemType={itemType} itemId={itemId} textType={textType} textId={textId} up={up}
                                      down={down} status={status}/>
                        </div>
                    </Modal>)}
            </WindowContext.Consumer>
        );
    }
}

export default withRouter(withCookies(TextModal));
