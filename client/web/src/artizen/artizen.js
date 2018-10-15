import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import request from 'request';
import ArtizenHeader from './artizen-header';
import {API_ENDPOINT} from '../common';
import './artizen.css';

class Artizen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artizen: {}
        };
        this.updateArtizen = this.updateArtizen.bind(this);
    }

    componentDidMount() {
        this.updateArtizen(this.props.match.params.artizenId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.artizenId !== this.props.match.params.artizenId) {
            this.updateArtizen(this.props.match.params.artizenId);
        }
    }

    updateArtizen(artizenId) {
        request.get({
            url: `${API_ENDPOINT}/artizen/${artizenId}`,
            json: true
        }, (error, response, body) => {
            if (response && response.statusCode === 200) {
                this.setState({artizen: body});
            }
        });
    }

    render() {
        return (
            <div className="artizen">
                <ArtizenHeader
                    name={this.state.artizen.name && this.state.artizen.name.default}
                    avatar={this.state.artizen.avatar}
                    style={{width: 500, backgroundColor: '#fafafa'}}
                />
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
