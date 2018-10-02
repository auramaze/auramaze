import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import './searchbox.css';

class Searchbox extends Component {
    render() {
        return (
            <div {...this.props}>
                <div className="slogan">AuraMaze</div>
                <form>
                    <div className="searchbox">
                        <input value="Coming Soon!" readOnly/>
                        <div className="icon">
                            <FontAwesomeIcon icon={faSearch} size="lg"/>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Searchbox;
