import React, {Component} from 'react';
import './art-card.css';
import '../common.css';

class ArtCard extends Component {
    render() {
        return (
            <div {...this.props} className="art-card card-shadow">
                {this.props.image ? <img src={this.props.image} alt="avatar" className="art-card-artwork"/> :
                    <div className="art-card-artwork" style={{backgroundColor: '#cdcdcd', height: 200}}/>}
                <div className="art-card-title">
                    <div className="art-card-names">
                        <span className="art-card-name">{this.props.title}</span><br/>
                        <span className="art-card-subname">{this.props.artist}, {this.props.completionYear}</span>
                    </div>
                    {this.props.avatar && <img src={this.props.avatar} alt="avatar" className="art-card-avatar"/>}
                </div>
                <div className="art-card-abstract">
                    {this.props.abstract}
                    <div className="art-card-mask-bottom"/>
                </div>
            </div>
        );
    }
}

export default ArtCard;
