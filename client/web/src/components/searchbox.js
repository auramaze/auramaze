import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {withRouter} from 'react-router-dom';
import './searchbox.css';

class Searchbox extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        const {style, history} = this.props;
        return (
            <div style={style}>
                <div className="slogan">AuraMaze</div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    history.push(`/search?q=${encodeURIComponent(this.state.value)}`);
                }}>
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

export default withRouter(Searchbox);
