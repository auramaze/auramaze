import React, {Component} from 'react';
import './inputbox.css';

class Inputbox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {onChange, style, ...props} = this.props;
        return (
            <div className="inputbox" style={style}>
                <input {...props} onChange={(e) => {
                    onChange && onChange(e.target.value);
                }}/>
            </div>
        );
    }
}

export default Inputbox;
