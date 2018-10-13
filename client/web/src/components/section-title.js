import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './section-title.css';

class SectionTitle extends Component {
    render() {
        return (
            <div {...this.props} className="title">
                {this.props.title}
            </div>
        );
    }
}

SectionTitle.propTypes = {
    title: PropTypes.string,
};

export default SectionTitle;
