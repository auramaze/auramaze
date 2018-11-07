import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import Navbar from './components/navbar';
import NavbarMobile from './components/navbar-mobile';
import Home from './home/home';
import Search from './search/search';
import Art from './art/art';
import Artizen from './artizen/artizen';
import Modal from './components/modal';

export const AuthContext = React.createContext();

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

        this.createAuth = (id, username, token) => {
            this.setState({
                auth: {id, username, token},
            });
        };

        this.state = {
            windowWidth: document.documentElement.clientWidth,
            expand: false,
            auth: {
                id: null,
                username: null,
                token: null
            },
            createAuth: this.createAuth
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
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
            <AuthContext.Provider value={this.state}>
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
            </AuthContext.Provider>
        );
    }
}

export default App;
