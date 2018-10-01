import React, {Component} from 'react';
import PropTypes from 'prop-types';
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

Art.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            artId: PropTypes.number
        })
    }),
};

export default Art;
