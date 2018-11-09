import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import {withCookies, Cookies} from 'react-cookie';
import Navbar from './components/navbar';
import NavbarMobile from './components/navbar-mobile';
import Home from './home/home';
import Search from './search/search';
import Art from './art/art';
import Artizen from './artizen/artizen';
import SignupModal from "./components/signup-modal";
import LoginModal from "./components/login-modal";

export const ModalContext = React.createContext();

const HomeNavbar = (props) => {
    return (
        <Navbar
            home
            {...props}
        />
    );
};

const HomeNavbarMobile = (props) => {
    return (
        <NavbarMobile
            home
            {...props}
        />
    );
};

class App extends Component {
    constructor(props) {
        super(props);

        this.showSignupModal = () => {
            this.setState({
                signupModalShow: true,
            });
        };

        this.hideSignupModal = () => {
            this.setState({
                signupModalShow: false,
            });
        };

        this.showLoginModal = () => {
            this.setState({
                loginModalShow: true,
            });
        };

        this.hideLoginModal = () => {
            this.setState({
                loginModalShow: false,
            });
        };

        this.state = {
            windowWidth: document.documentElement.clientWidth,
            expand: false,
            signupModalShow: false,
            loginModalShow: false,
            showSignupModal: this.showSignupModal,
            hideSignupModal: this.hideSignupModal,
            showLoginModal: this.showLoginModal,
            hideLoginModal: this.hideLoginModal
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentDidUpdate(prevProps, prevState) {
        const id = this.props.cookies.get('id');

        if (id && prevState.signupModalShow) {
            this.setState({signupModalShow: false});
        }

        if (id && prevState.loginModalShow) {
            this.setState({loginModalShow: false});
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            windowWidth: document.documentElement.clientWidth,
        });
    }

    render() {
        return (
            <ModalContext.Provider value={{
                signupModalShow: this.state.signupModalShow,
                loginModalShow: this.state.loginModalShow,
                showSignupModal: this.state.showSignupModal,
                hideSignupModal: this.state.hideSignupModal,
                showLoginModal: this.state.showLoginModal,
                hideLoginModal: this.state.hideLoginModal
            }}>
                <Router>
                    <div>
                        <Route exact path="/" component={Home}/>
                        <Route path="/search" component={Search}/>
                        <Route path="/art/:artId" component={Art}/>
                        <Route path="/artizen/:artizenId" component={Artizen}/>
                        <Switch>
                            <Route
                                exact
                                path="/"
                                render={this.state.windowWidth > 768 ? HomeNavbar : HomeNavbarMobile}
                            />
                            <Route
                                path='/'
                                component={this.state.windowWidth > 768 ? Navbar : NavbarMobile}
                            />
                        </Switch>
                    </div>
                </Router>
                <SignupModal show={this.state.signupModalShow} handleClose={this.state.hideSignupModal}/>
                <LoginModal show={this.state.loginModalShow} handleClose={this.state.hideLoginModal}/>
            </ModalContext.Provider>
        );
    }
}

export default withCookies(App);
