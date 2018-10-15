import React, {Component} from 'react';
import './artizen-card.css';
import '../common.css';

class ArtizenCard extends Component {
    render() {
        const {name, avatar, abstract, extended, ...props} = this.props;
        return (
            <div {...props} className="artizen-card card-shadow">
                <div className="artizen-card-title">
                    {avatar ? <img src={avatar} alt="avatar" className="artizen-card-avatar"/> :
                        <div className="artizen-card-avatar" style={{backgroundColor: '#cdcdcd'}}/>}
                    <span className="artizen-card-name">{name}</span>
                </div>
                {extended && <div className="artizen-card-abstract">
                    {abstract}
                    <div className="artizen-card-mask-bottom"/>
                </div>}
            </div>
        );
    }
}

export default ArtizenCard;
