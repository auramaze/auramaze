import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ArtizenHeader from './artizen-header';
import './artizen.css';

class Artizen extends Component {
    componentDidMount() {
        console.log(this.props.match.params.artizenId);
    }

    render() {
        return (
            <div className="artizen">
                <ArtizenHeader style={{width: 500, backgroundColor: '#fafafa'}}/>
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
