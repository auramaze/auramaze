import React, {Component} from 'react';
import './library-card.css';

class LibraryCard extends Component {
    render() {
        const {name, avatar, content, ...props} = this.props;
        return (
            <div {...props} className="library-card card-shadow">
                <div className="library-card-title">
                    {avatar ? <img src={avatar} alt="avatar" className="library-card-avatar"/> :
                        <div className="library-card-avatar" style={{backgroundColor: '#cdcdcd'}}/>}
                    <span className="library-card-name">{name}</span>
                </div>
                <div className="library-card-content">
                    {content}
                </div>
            </div>
        );
    }
}

export default LibraryCard;
