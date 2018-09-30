import React, {Component} from 'react';
import {Motion, spring} from 'react-motion';
import './Slides.css';

class Slides extends Component {
    constructor(props) {
        super(props);
        this.state = {width: 0, height: 0};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        const currentImgSrc = 'https://s3.us-east-2.amazonaws.com/auramaze-test/slides/starry-night.jpg';
        //const currentImgStyle =
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    render() {
        return (
            <div className="Slides" style={{height: this.state.height, backgroundColor: '#666666'}}>
                <Motion defaultStyle={{x: 0}} style={{x: spring(1000)}} onRest={()=>{alert('onRest');}}>

                    {value => <img src="https://s3.us-east-2.amazonaws.com/auramaze-test/slides/starry-night.jpg"
                                   height={value.x}/>}
                </Motion>


            </div>
        );
    }
}

export default Slides;
