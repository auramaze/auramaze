import React, {Component} from 'react';
import './artizen-card.css';
import '../common.css';

class ArtizenCard extends Component {
    render() {
        return (
            <div {...this.props} className="artizen-card card-shadow">
                <div className="artizen-card-title">
                    {this.props.avatar ? <img src={this.props.avatar} alt="avatar" className="artizen-card-avatar"/> :
                        <div className="artizen-card-avatar" style={{backgroundColor: '#cdcdcd'}}/>}
                    <span className="artizen-card-name">Paul Cezanne</span>
                </div>
                {this.props.abstract && <div className="artizen-card-abstract">
                    {this.props.abstract}
                    <div className="artizen-card-mask-bottom"/>
                </div>}
            </div>
        );
    }
}

export default ArtizenCard;
