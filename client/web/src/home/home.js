import React, {Component} from 'react';
import Lottie from 'react-lottie';
import * as animationData from './data.json';
import Fade from 'react-reveal/Fade';
import Slides from './slides';
import Pitch from './pitch';
import Footer from '../components/footer';
import ArtizenCard from '../components/artizen-card';
import './home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: document.documentElement.clientWidth,
            windowHeight: window.innerHeight,
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
            windowHeight: window.innerHeight
        });
    }

    render() {
        return (
            <div className="home">
                <Slides windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>
                <Pitch windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>
                <div className="backend-architecture">
                    <Fade bottom>
                        <div className="lottie-container">
                            <Lottie
                                options={{
                                    loop: true, autoplay: true, animationData: animationData, renderer: 'svg'
                                }}
                            />
                        </div>
                    </Fade>
                </div>
                <div className="library-cards">
                    <Fade bottom>
                        <ArtizenCard
                            style={{margin: 20}}
                            name="Nginx"
                            avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_10.png"
                            abstract="Load balancer to distribute requests to multiple API servers."
                            extended titleFontSize={25}
                            contentFontSize={20}
                        />
                    </Fade>
                    <Fade bottom>
                        <ArtizenCard
                            style={{margin: 20}}
                            name="Express.js API"
                            avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_9.png"
                            abstract="Provide endpoints for GET, PUT, POST, DELETE actions of artwork information. Connected with Aurora and DynamoDB to update databases."
                            extended titleFontSize={25}
                            contentFontSize={20}
                        /></Fade>
                    <Fade bottom>
                        <ArtizenCard
                            style={{margin: 20}}
                            name="AWS Aurora"
                            avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_5.png"
                            abstract="Basic information of artworks, artist, museums, genres, etc. and users, as well as relationship between items including painting, collecting, exhibiting, etc."
                            extended titleFontSize={25}
                            contentFontSize={20}
                        /></Fade>
                    <Fade bottom>
                        <ArtizenCard
                            style={{margin: 20}}
                            name="AWS DynamoDB"
                            avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_4.png"
                            abstract="Supplementary data of items, such as museum address, artist’s date of birth. These data are all key-value pairs fetched from public domain sources (i.e. Wikipedia) by web crawlers."
                            extended titleFontSize={25}
                            contentFontSize={20}
                        /></Fade>
                    <Fade bottom>
                        <ArtizenCard
                            style={{margin: 20}}
                            name="AWS S3"
                            avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_3.png"
                            abstract="Raw image of artworks and static image content of the website."
                            extended titleFontSize={25}
                            contentFontSize={20}
                        /></Fade>
                    <Fade bottom>
                        <ArtizenCard
                            style={{margin: 20}}
                            name="Kafka"
                            avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_2.png"
                            abstract="Message queue and CDC tool to capture database change and update Microservices in real time."
                            extended titleFontSize={25}
                            contentFontSize={20}
                        /></Fade>
                    <Fade bottom>
                        <ArtizenCard
                            style={{margin: 20}}
                            name="ElasticSearch"
                            avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_7.png"
                            abstract="Text Search Engine and Image Signature Search Engine."
                            extended titleFontSize={25}
                            contentFontSize={20}
                        /></Fade>
                    <Fade bottom>
                        <ArtizenCard
                            style={{margin: 20}}
                            name="Tensorflow"
                            avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_6.png"
                            abstract="Machine learning model for Recommender System."
                            extended titleFontSize={25}
                            contentFontSize={20}
                        /></Fade>
                    <Fade bottom>
                        <ArtizenCard
                            style={{margin: 20}}
                            name="Stanford CoreNLP"
                            avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_8.png"
                            abstract="Natural Language Processing on user input comments to analyze preference on art."
                            extended titleFontSize={25}
                            contentFontSize={20}
                        /></Fade>
                </div>
                <Footer windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>
            </div>
        );
    }
}

export default Home;
