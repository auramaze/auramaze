import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons';

const SlickPrevArror = (props) => {
    const {onClick} = props;
    return <div
        onClick={onClick}
        style={{
            zIndex: 100,
            position: 'absolute',
            left: -30,
            top: '50%',
            transform: 'translate(0, -50%)',
            color: '#666666',
            fontSize: 20,
            padding: 15,
            cursor: 'pointer'
        }}>
        <FontAwesomeIcon icon={faAngleLeft} size="lg"/>
    </div>;
};

SlickPrevArror.propTypes = {
    onClick: PropTypes.func,
};

export default SlickPrevArror;
