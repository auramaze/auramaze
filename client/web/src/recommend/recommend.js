import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withCookies} from 'react-cookie';
import ItemList from '../components/item-list';
import './recommend.css';
import request from 'request';
import {API_ENDPOINT} from '../common';
import {ModalContext} from "../app";
import {removeCookies} from "../utils";

class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {art: [], artizen: []}
        };
    }

    componentDidMount() {
        const {cookies, showLoginModal} = this.props;
        const token = cookies.get('token');

        if (token) {
            request.get({
                url: `${API_ENDPOINT}/recommend`,
                headers: token && {
                    'Authorization': `Bearer ${token}`
                },
                json: true
            }, (error, response, items) => {
                if (response && response.statusCode === 200) {
                    this.setState({
                        items: items
                    });
                } else if (response.statusCode === 401) {
                    removeCookies(cookies);
                    showLoginModal();
                }
            });
        } else {
            showLoginModal();
        }
    }

    render() {
        return (

            <div className="recommend">
                <ItemList items={this.state.items} extended/>
            </div>
        );
    }
}

export default withCookies(React.forwardRef((props, ref) => (
    <ModalContext.Consumer>
        {({showLoginModal}) => <Recommend {...props} showLoginModal={showLoginModal} ref={ref}/>}
    </ModalContext.Consumer>)
));
