import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Search from './Search';
import Art from './Art';
import Artizen from './Artizen';
import './App.css';

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
