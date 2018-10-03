import React, {Component} from 'react';
import './pitch-card.css';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class PitchCard extends Component {
    constructor(props) {
        super(props);
        this.state = {hovered: false};
    }


    render() {
        return (
            <div className='pitch-card'>
                <table>
                    <tbody>
                        <tr>
                            <td width='60'>
                                <div className="title">
                                    {this.props.cardTitle}
                                </div>
                            </td>
                            <td width='40'>
                                <FontAwesomeIcon icon={this.props.cardIconSrc} size="2x"/>
                            </td>
                        </tr>
                        <tr>
                            <td width='100%'>
                                <div className="text">
                                    {this.props.cardText}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

PitchCard.propTypes = {
    cardTitle: PropTypes.string,
    cardText: PropTypes.string,
    cardIconSrc: PropTypes.object,
};

export default PitchCard;
