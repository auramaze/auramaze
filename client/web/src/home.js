import React, {Component} from 'react';
import Slides from './slides';
import Footer from './footer';
import './home.css';

class Home extends Component {
    render() {
        return (
            <div>
                <Slides/>
                <Footer/>
            </div>
        );
    }
}

export default Home;
