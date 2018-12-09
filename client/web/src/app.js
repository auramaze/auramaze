import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import {withCookies} from 'react-cookie';
import {IntlProvider} from "react-intl";
import Navbar from './components/navbar';
import NavbarMobile from './components/navbar-mobile';
import Home from './home/home';
import Search from './search/search';
import Privacy from './privacy/privacy';
import Recommend from './recommend/recommend';
import Art from './art/art';
import Artizen from './artizen/artizen';
import SignupModal from "./components/signup-modal";
import LoginModal from "./components/login-modal";
import TextModal from "./components/text-modal";
import messages_en from "./translations/en.json";
import messages_zh from "./translations/zh.json";

const messages = {
    'en': messages_en,
    'zh': messages_zh
};

export const LanguageContext = React.createContext();
export const ModalContext = React.createContext();
export const WindowContext = React.createContext();
export const VoteContext = React.createContext();

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

        this.updateVote = (vote) => {
            this.setState({vote});
        };

        let language = props.cookies.get('language') || window.navigator.language;
        if (typeof language === 'string') {
            language = language.slice(0, 2);
        }
        if (!language in messages) {
            language = 'en';
        }

        this.state = {
            language: language,
            windowWidth: document.documentElement.clientWidth,
            windowHeight: window.innerHeight,
            signupModalShow: false,
            loginModalShow: false,
            showSignupModal: this.showSignupModal,
            hideSignupModal: this.hideSignupModal,
            showLoginModal: this.showLoginModal,
            hideLoginModal: this.hideLoginModal,
            vote: {},
            updateVote: this.updateVote
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
            windowHeight: window.innerHeight
        });
    }

    render() {
        const {language, windowWidth, windowHeight, signupModalShow, loginModalShow, showSignupModal, hideSignupModal, showLoginModal, hideLoginModal, vote, updateVote} = this.state;
        return (
            <IntlProvider locale={language} messages={messages[language]}>
                <LanguageContext.Provider value={{language}}>
                    <WindowContext.Provider value={{windowWidth, windowHeight}}>
                        <ModalContext.Provider value={{
                            signupModalShow,
                            loginModalShow,
                            showSignupModal,
                            hideSignupModal,
                            showLoginModal,
                            hideLoginModal
                        }}>
                            <VoteContext.Provider value={{vote, updateVote}}>
                                <Router>
                                    <div>
                                        <Route exact path="/" component={Home}/>
                                        <Route path="/search" component={Search}/>
                                        <Route path="/privacy" component={Privacy}/>
                                        <Route path="/recommend" component={Recommend}/>
                                        <Route path="/art/:artId" component={Art}/>
                                        <Route path="/artizen/:artizenId" component={Artizen}/>
                                        <Route
                                            path="/:itemType(art|artizen)/:itemId/:textType(introduction|review)/:textId"
                                            component={TextModal}/>
                                        <Switch>
                                            <Route
                                                exact
                                                path="/"
                                                render={windowWidth > 768 ? HomeNavbar : HomeNavbarMobile}
                                            />
                                            <Route
                                                path='/'
                                                component={windowWidth > 768 ? Navbar : NavbarMobile}
                                            />
                                        </Switch>
                                    </div>
                                </Router>
                                <SignupModal show={signupModalShow} handleClose={hideSignupModal}/>
                                <LoginModal show={loginModalShow} handleClose={hideLoginModal}/>
                            </VoteContext.Provider>
                        </ModalContext.Provider>
                    </WindowContext.Provider>
                </LanguageContext.Provider>
            </IntlProvider>
        );
    }
}

export default withCookies(App);
