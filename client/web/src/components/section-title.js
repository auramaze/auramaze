import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './section-title.css';

class SectionTitle extends Component {
    render() {
        const {sectionTitle, children, ...props} = this.props;
        return (
            <div {...props} className="section-title">
                {sectionTitle}
                <div className="section-title-addon">
                    {children}
                </div>
            </div>
        );
    }
}

SectionTitle.propTypes = {
    sectionTitle: PropTypes.string,
};

export default SectionTitle;
