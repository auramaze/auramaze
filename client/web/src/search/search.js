import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as qs from 'query-string';
import ItemList from '../components/item-list';
import './search.css';
import request from 'request';
import {API_ENDPOINT} from '../common';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: Search.getQueryFromProps(props),
            art: [],
            artizen: [],
            items: {art: [], artizen: []}
        };
    }

    static getQueryFromProps(props) {
        return qs.parse(props.location.search, {ignoreQueryPrefix: true}).q;
    }

    componentDidMount() {
        request.get({
            url: `${API_ENDPOINT}/search?index=art&q=${encodeURIComponent(this.state.query)}`,
            json: true
        }, (error, response, body) => {
            if (response && response.statusCode === 200) {
                this.setState({
                    art: body.data
                });
            }
        });
        request.get({
            url: `${API_ENDPOINT}/search?index=artizen&q=${encodeURIComponent(this.state.query)}`,
            json: true
        }, (error, response, body) => {
            if (response && response.statusCode === 200) {
                this.setState({
                    artizen: body.data
                });
            }
        });
    }

    render() {
        return (
            <div className="search">
                <ItemList key={Search.getQueryFromProps(this.props)}
                          items={{art: this.state.art, artizen: this.state.artizen}} extended/>
            </div>
        );
    }
}

Search.propTypes = {
    location: PropTypes.object,
};

export default Search;
