import React, {Component} from 'react';
import './Artizen.css';

class Artizen extends Component {
    render() {
        return (
            <div>
                <h3>{this.props.match.params.artizenId}</h3>
            </div>
        );
    }
}

export default Artizen;
