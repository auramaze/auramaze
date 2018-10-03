import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';
import Navbar from './navbar';
import NavbarMobile from './navbar-mobile';
import Home from './home';
import Search from './search';
import Art from './art';
import Artizen from './artizen';

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
        this.state = {
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight,
            expand: false
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
            windowHeight: document.documentElement.clientHeight
        });
    }

    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Home}/>
                    <Route path="/search" component={Search}/>
                    <Route path="/art/:artId" component={Art}/>
                    <Route path="/artizen/:artizenId" component={Artizen}/>
                    <Switch>
                        <Route exact path="/" render={this.state.windowWidth > 768 ? HomeNavbar : HomeNavbarMobile}/>
                        <Route path='/' component={this.state.windowWidth > 768 ? Navbar : NavbarMobile}/>
                    </Switch>

                </div>
            </Router>
        );
    }
}

export default App;
