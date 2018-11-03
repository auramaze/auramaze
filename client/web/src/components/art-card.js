import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Editor} from 'draft-js';
import {convertHTMLToEditorState} from "../utils";
import './art-card.css';

class ArtCard extends Component {
    render() {
        const {id, username, image, title, artist, avatar, completionYear, abstract, extended, ...props} = this.props;
        const editorState = convertHTMLToEditorState(abstract);

        return (
            <div {...props} className="art-card card-shadow">
                <Link to={`/art/${username || id}`}>
                    {image ? <img src={image} alt="avatar" className="art-card-artwork"/> :
                        <div className="art-card-artwork" style={{backgroundColor: '#cdcdcd', height: 0}}/>}
                    <div className="art-card-title">
                        <div className="art-card-names">
                            <span className="art-card-name">{title}</span><br/>
                            <span className="art-card-subname">{artist}{completionYear && `, ${completionYear}`}</span>
                        </div>
                        {avatar && <img src={avatar} alt="avatar" className="art-card-avatar"/>}
                    </div>
                    {extended && <div className="art-card-abstract">
                        {editorState && <Editor
                            editorState={editorState}
                            readOnly
                        />}
                        <div className="art-card-mask-bottom"/>
                    </div>}
                </Link>
            </div>
        );
    }
}

export default ArtCard;
