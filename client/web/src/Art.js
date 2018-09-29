import React, {Component} from 'react';
import './Art.css';

class Art extends Component {
    render() {
        return (
            <div>
                <h3>{this.props.match.params.artId}</h3>
            </div>
        );
    }
}

export default Art;
