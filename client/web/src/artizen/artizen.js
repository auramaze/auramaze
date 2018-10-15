import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './artizen.css';

class Artizen extends Component {
    render() {
        return (
            <div className="artizen">
                <h3>{this.props.match.params.artizenId}</h3>
            </div>
        );
    }
}

Artizen.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            artizenId: PropTypes.string
        })
    }),
};

export default Artizen;
