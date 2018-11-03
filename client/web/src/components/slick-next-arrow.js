import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleRight} from '@fortawesome/free-solid-svg-icons';

const SlickNextArror = (props) => {
    const {onClick} = props;
    return <div
        onClick={onClick}
        style={{
            zIndex: 100,
            position: 'absolute',
            right: -30,
            top: '50%',
            transform: 'translate(0, -50%)',
            color: '#666666',
            fontSize: 20,
            padding: 15,
            cursor: 'pointer'
        }}>
        <FontAwesomeIcon icon={faAngleRight} size="lg"/>
    </div>;
};

SlickNextArror.propTypes = {
    onClick: PropTypes.func,
};

export default SlickNextArror;
