import React, {Component} from 'react';
import * as qs from 'query-string';
import ItemList from '../components/item-list';
import './search.css';
import request from "request";
import {API_ENDPOINT} from "../common";

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
        }, (error, response, body) => {
            if (response && response.statusCode === 200) {
                this.setState({items: body});
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

export default Search;
