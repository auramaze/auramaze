import React, {Component} from 'react';
import './buttonbox.css';

class Buttonbox extends Component {
    constructor(props) {
        super(props);
        this.state = {hover: false};
    }

    render() {
        const {children, disabled, onClick, ...props} = this.props;
        return (
            <div className="buttonbox font-size-s" {...props}
                 onClick={(e) => {
                     if (disabled) {
                         e.preventDefault();
                     } else {
                         onClick && onClick(e);
                     }
                 }}
                 onMouseEnter={() => {
                     this.setState({hover: !disabled});
                 }}
                 onMouseLeave={() => {
                     this.setState({hover: false});
                 }}>
                <div className={this.state.hover ? 'buttonbox-content-hover' : 'buttonbox-content'}
                     style={{borderColor: props.style.color}}>
                    {children}
                </div>
            </div>
        );
    }
}

export default Buttonbox;
