import React, {Component} from 'react';
import {withCookies} from 'react-cookie';
import request from "request";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheckCircle} from '@fortawesome/free-regular-svg-icons';
import Buttonbox from './buttonbox';
import {ModalContext} from '../app';
import {API_ENDPOINT} from "../common";
import {removeCookies} from "../utils";

const followStyle = {
    margin: '10px auto',
    width: 90,
    height: 36,
    borderRadius: 18,
    border: 'solid 2px #666666',
    whiteSpace: 'nowrap',
    backgroundColor: '#ffffff',
    color: '#666666',
    transition: 'width 0.25s'
};

const followingStyle = {
    margin: '10px auto',
    width: 125,
    height: 36,
    borderRadius: 18,
    border: 'solid 2px #666666',
    whiteSpace: 'nowrap',
    backgroundColor: '#ffffff',
    color: '#666666',
    transition: 'width 0.25s'
};

class Follow extends Component {
    constructor(props) {
        super(props);
        this.state = {status: props.status};
        this.handleFollow = this.handleFollow.bind(this);
    }

    componentDidUpdate(prevProps) {
        const {status} = this.props;
        if (status !== prevProps.status) {
            this.setState({status});
        }
    }

    handleFollow(type, showLoginModal) {
        const {id, cookies} = this.props;
        const {status} = this.state;
        if (status ^ type) {
            const token = cookies.get('token');
            if (token) {
                request.post({
                    url: `${API_ENDPOINT}/artizen/${id}/follow`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: {type},
                    json: true
                }, (error, response, body) => {
                    if (response && response.statusCode === 200) {
                        this.setState({
                            status: type
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
    }

    render() {
        const {status} = this.state;
        return (<ModalContext.Consumer>
                {({showLoginModal}) => (
                    <div className="follow">
                        {status ?
                            <Buttonbox
                                style={followingStyle}
                                onClick={() => {
                                    this.handleFollow(!status, showLoginModal);
                                }}
                            >
                                <span className="font-size-xs">
                                    <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        size="sm"
                                    /> Following</span>
                            </Buttonbox> :
                            <Buttonbox
                                style={followStyle}
                                onClick={() => {
                                    this.handleFollow(!status, showLoginModal);
                                }}
                            >
                                <span className="font-size-xs">Follow</span>
                            </Buttonbox>}

                    </div>)}
            </ModalContext.Consumer>
        );
    }
}

export default withCookies(Follow);
