import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import Navbar from './navbar';
import Home from './home';
import Search from './search';
import Art from './art';
import Artizen from './artizen';

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Home}/>
                    <Route path="/search" component={Search}/>
                    <Route path="/art/:artId" component={Art}/>
                    <Route path="/artizen/:artizenId" component={Artizen}/>
                    <Navbar/>
                </div>
            </Router>
        );
    }
}

export default App;
