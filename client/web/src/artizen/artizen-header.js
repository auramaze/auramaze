import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './artizen-header.css';

class ArtizenHeader extends Component {
    render() {
        const {...props} = this.props;
        return (
            <div className="artizen-header" {...props}>
                <div className="artizen-header-avatar">
                    <img
                        src="https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/vincent-van-gogh.jpg"
                        alt="avatar"
                        className="artizen-header-avatar-img"
                    />
                </div>
            </div>
        );
    }
}

export default ArtizenHeader;
