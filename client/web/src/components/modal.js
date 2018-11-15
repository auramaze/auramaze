import React, {Component} from 'react';
import {lockBody, unlockBody} from '../utils';
import './modal.css';

class Modal extends Component {
    componentDidUpdate(prevProps) {
        if (this.props.show) {
            lockBody();
        } else {
            if (prevProps.show) {
                unlockBody();
            }
        }
    }

    render() {
        const {handleClose, show, style, hideCloseButton, children} = this.props;
        const showHideClassName = show ? 'modal modal-show' : 'modal modal-hidden';

        return (
            <div className={showHideClassName}>
                <div className="modal-background" onClick={handleClose}/>
                <section className="modal-main card-shadow" style={style}>
                    {children}
                    {!hideCloseButton && <div
                        className="modal-close-button"
                        onClick={handleClose}
                    >
                        <div className="modal-close-line-1"/>
                        <div className="modal-close-line-2"/>
                    </div>}
                </section>
            </div>
        );
    }
}

export default Modal;
