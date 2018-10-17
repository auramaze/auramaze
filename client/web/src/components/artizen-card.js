import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './artizen-card.css';

class ArtizenCard extends Component {
    render() {
        const {id, username, name, avatar, abstract, extended, titleFontSize, contentFontSize, ...props} = this.props;
        return (
            <div {...props} className="artizen-card card-shadow">
                <Link to={(username || id) ? `/artizen/${username || id}` : '#'}>
                    <div className="artizen-card-title">
                        {avatar ? <img src={avatar} alt="avatar" className="artizen-card-avatar"/> :
                            <div className="artizen-card-avatar" style={{backgroundColor: '#cdcdcd'}}/>}
                        <span className="artizen-card-name" style={{fontSize: titleFontSize}}>{name}</span>
                    </div>
                    {extended && <div className="artizen-card-abstract" style={{fontSize: contentFontSize}}>
                        {abstract}
                        <div className="artizen-card-mask-bottom"/>
                    </div>}
                </Link>
            </div>
        );
    }
}

export default ArtizenCard;
