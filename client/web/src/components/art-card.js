import React, {Component} from 'react';
import './art-card.css';
import '../common.css';

class ArtCard extends Component {
    render() {
        const {image, title, artist, avatar, completionYear, abstract, extended, ...props} = this.props;
        return (
            <div {...props} className="art-card card-shadow">
                {image ? <img src={image} alt="avatar" className="art-card-artwork"/> :
                    <div className="art-card-artwork" style={{backgroundColor: '#cdcdcd', height: 200}}/>}
                <div className="art-card-title">
                    <div className="art-card-names">
                        <span className="art-card-name">{title}</span><br/>
                        <span className="art-card-subname">{artist}{completionYear && `, ${completionYear}`}</span>
                    </div>
                    {avatar && <img src={avatar} alt="avatar" className="art-card-avatar"/>}
                </div>
                {extended && <div className="art-card-abstract">
                    {abstract}
                    <div className="art-card-mask-bottom"/>
                </div>}
            </div>
        );
    }
}

export default ArtCard;
