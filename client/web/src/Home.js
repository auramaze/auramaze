import React, {Component} from 'react';
import Slides from './slides';
import './home.css';

class Home extends Component {
    render() {
        return (
            <div>
                <Slides/>
                <h2 style={{marginBottom: 4000}}>Home</h2>
            </div>
        );
    }
}

export default Home;
