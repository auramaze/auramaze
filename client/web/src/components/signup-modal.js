import React, {Component} from 'react';
import Modal from './modal';
import Inputbox from './inputbox';
import './signup-modal.css';

class SignupModal extends Component {
    constructor(props) {
        super(props);
        this.state = {name: '', email: '', password: ''};
    }

    render() {
        return (
            <Modal {...this.props}>
                <div className="signup-modal-content">
                    <p>Sign up</p>
                    <Inputbox
                        value={this.state.name}
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={(value) => {
                            this.setState({name: value})
                        }}
                    />
                    <Inputbox
                        value={this.state.email}
                        type="text"
                        name="email"
                        placeholder="Email"
                        onChange={(value) => {
                            this.setState({email: value})
                        }}
                    />
                    <Inputbox
                        value={this.state.password}
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(value) => {
                            this.setState({password: value})
                        }}
                    />
                </div>
            </Modal>
        );
    }
}

export default SignupModal;
