import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import './searchbox.css';

class Searchbox extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <div {...this.props}>
                <div className="slogan">AuraMaze</div>
                <form action="/search" method="get">
                    <div className="searchbox">
                        <input name="q" type="text" value={this.state.value} onChange={this.handleChange}/>
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
