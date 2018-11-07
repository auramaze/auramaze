import React, {Component} from 'react';
import './modal.css';

class Modal extends Component {
    componentDidUpdate() {
        document.body.style.overflow = this.props.show ? 'hidden' : 'visible';
    }

    render() {
        const {handleClose, show, children} = this.props;
        const showHideClassName = show ? 'modal modal-show' : 'modal modal-hidden';

        return (
            <div className={showHideClassName}>
                <div className="modal-background" onClick={handleClose}/>
                <section className="modal-main card-shadow">
                    {children}
                    <div
                        className="modal-close-button"
                        onClick={handleClose}
                    >
                        <div className="modal-close-line-1"/>
                        <div className="modal-close-line-2"/>
                    </div>
                </section>
            </div>
        );
    }
}

export default Modal;
