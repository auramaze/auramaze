import React, {Component} from 'react';
import './inputbox.css';

class Inputbox extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onChange(event.target.value);
    }

    render() {
        const {onChange, ...props} = this.props;
        return (
            <div className="inputbox">
                <input {...props} onChange={this.handleChange}/>
            </div>
        );
    }
}

export default Inputbox;
