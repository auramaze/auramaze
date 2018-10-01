import React, {Component} from 'react';
import PropTypes from 'prop-types';
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

Artizen.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            artizenId: PropTypes.number
        })
    }),
};

export default Artizen;
