import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons'
import './Searchbox.css';

class Searchbox extends Component {
    render() {
        return (
            <div {...this.props}>
                <span className="slogan">AuraMaze</span>
                <form>
                    <div className="Searchbox">
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
