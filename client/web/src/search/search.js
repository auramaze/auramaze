import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as qs from 'query-string';
import ItemList from '../components/item-list';
import './search.css';
import request from 'request';
import after from 'lodash.after';
import {API_ENDPOINT} from '../common';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: qs.parse(props.location.search, {ignoreQueryPrefix: true}).q,
            items: {art: [], artizen: []}
        };
    }

    componentDidMount() {
        request.get({
            url: `${API_ENDPOINT}/search?q=${encodeURIComponent(this.state.query)}`,
            json: true
        }, (error, response, items) => {
            let get = after(2, () => {
                this.setState({
                    items: items
                });
            });
            if (response && response.statusCode === 200) {
                request.post({
                    url: `${API_ENDPOINT}/art/batch`,
                    body: {id: items.art.map(art => art.id)},
                    json: true
                }, (error, response, body) => {
                    if (response && response.statusCode === 200) {
                        items.art = items.art.map(art => Object.assign(art, body[art.id]));
                        get();
                    }
                });
                request.post({
                    url: `${API_ENDPOINT}/artizen/batch`,
                    body: {id: items.artizen.map(artizen => artizen.id)},
                    json: true
                }, (error, response, body) => {
                    if (response && response.statusCode === 200) {
                        items.artizen = items.artizen.map(artizen => Object.assign(artizen, body[artizen.id]));
                        get();
                    }
                });
            }
        });
    }

    render() {
        return (
            <div className="search">
                <ItemList items={this.state.items} extended/>
            </div>
        );
    }
}

Search.propTypes = {
    location: PropTypes.object,
};

export default Search;
