import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import logo from './logo-white-frame.svg';
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
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/search">Search</Link></li>
                        <li><Link to="/topics">Topics</Link></li>
                    </ul>
                    <div className="App">
                        <header className="App-header">
                            <img src={logo} className="App-logo" alt="logo"/>
                            <h1 className="App-title">Welcome to React</h1>
                        </header>
                        <p className="App-intro">
                            To get started, edit <code>src/App.js</code> and save to reload.
                        </p>
                    </div>
                    <hr/>

                    <Route exact path="/" component={Home}/>
                    <Route path="/search" component={Search}/>
                    <Route path="/art/:artId" component={Art}/>
                    <Route path="/artizen/:artizenId" component={Artizen}/>
                </div>
            </Router>
        );
    }
}

export default App;
