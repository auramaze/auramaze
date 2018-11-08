import React, {Component} from 'react';
import './buttonbox.css';

class Buttonbox extends Component {
    constructor(props) {
        super(props);
        this.state = {hover: false};
    }

    render() {
        const {children, processing, onClick, ...props} = this.props;
        return (
            <div className="buttonbox font-size-s" {...props}
                 onClick={(e) => {
                     if (processing) {
                         e.preventDefault();
                     } else {
                         onClick && onClick(e);
                     }
                 }}
                 onMouseEnter={() => {
                     this.setState({hover: true});
                 }}
                 onMouseLeave={() => {
                     this.setState({hover: false});
                 }}>
                <div
                    className={processing ? 'buttonbox-content-processing' : this.state.hover ? 'buttonbox-content-hover' : 'buttonbox-content'}
                    style={{borderColor: props.style.color}}>
                    {children}
                </div>
            </div>
        );
    }
}

export default Buttonbox;
