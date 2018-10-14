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
            query: qs.parse(props.location.search, {ignoreQueryPrefix: true}).q,
            items: {art: [], artizen: []}
        };
    }

    componentDidMount() {
        request.get({
            url: `${API_ENDPOINT}/search?q=${encodeURIComponent(this.state.query)}`,
            json: true
        }, (error, response, items) => {
            if (response && response.statusCode === 200) {
                const id = items.art.map(art => art.id);
                request.post({
                    url: `${API_ENDPOINT}/art/bulk`,
                    body: {id: id},
                    json: true
                }, (error, response, body) => {
                    if (response && response.statusCode === 200) {
                        items.art = items.art.map(art => Object.assign(art, body[art.id]));
                        this.setState({
                            items: items
                        });
                    }
                });
            }
        });
    }

    render() {
        return (
            <div>
                <ItemList items={this.state.items}/>
            </div>
        );
    }
}

Search.propTypes = {
    location: PropTypes.object,
};

export default Search;
