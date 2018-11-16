import React, {Component} from 'react';
import './inputbox.css';

class Inputbox extends Component {
    render() {
        const {onChange, onBlur, style, ...props} = this.props;
        return (
            <div className="inputbox" style={style}>
                <input
                    className="font-size-m"
                    {...props}
                    onChange={(e) => {
                        onChange && onChange(e.target.value);
                    }}
                    onBlur={onBlur}
                />
            </div>
        );
    }
}

export default Inputbox;
