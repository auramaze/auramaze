import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './section-title.css';

class SectionTitle extends Component {
    render() {
        const {sectionTitle, ...props} = this.props;
        return (
            <div {...props} className="section-title">
                {this.props.sectionTitle}
            </div>
        );
    }
}

SectionTitle.propTypes = {
    sectionTitle: PropTypes.string,
};

export default SectionTitle;
