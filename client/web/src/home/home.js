import React, {Component} from 'react';
import Lottie from 'react-lottie';
import * as animationData from './data.json';
import Fade from 'react-reveal/Fade';
import Slides from './slides';
import Pitch from './pitch';
import Footer from '../components/footer';
import LibraryCard from './library-card';
import './home.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: document.documentElement.clientWidth,
            windowHeight: window.innerHeight,
            clickCount: document.documentElement.clientWidth > 992 ? 0 : 5,
            demoHeight: 0
        };
        this.column1 = React.createRef();
        this.column2 = React.createRef();
        this.demo = React.createRef();
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
            windowHeight: window.innerHeight,
            demoHeight: this.column1.current && this.column2.current && this.demo.current ? Math.max(this.column1.current.clientHeight, this.column2.current.clientHeight, this.demo.current.clientHeight) + 150 : 0
        });
    }

    render() {
        return (
            <div className="home">
                <Slides windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>
                <Pitch windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>

                {this.state.windowWidth > 992 ?
                    <div className="backend-architecture" style={{height: this.state.demoHeight}}>
                        <div
                            ref={this.column1}
                            className="library-cards-column-1"
                            style={{cursor: this.state.clickCount < 5 ? 'pointer' : 'default'}}
                            onClick={() => {
                                this.setState({clickCount: this.state.clickCount + 1});
                            }}
                        >
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 0}>
                                    <LibraryCard
                                        name="Nginx"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_21.png"
                                        content="Load balancer to redirect requests to multiple API servers."
                                    />
                                </Fade>
                            </div>
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 2}>
                                    <LibraryCard
                                        name="Amazon Aurora"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_22.png"
                                        content="Information of artworks, artist, museums, genres, etc. and users, as well as relationship between items including painting, collecting, exhibiting, etc."
                                    />
                                </Fade>
                            </div>
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 2}>
                                    <LibraryCard
                                        name="Amazon S3"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_3.png"
                                        content="Raw image of artworks and static image content of the website."
                                    />
                                </Fade>
                            </div>
                        </div>
                        <div ref={this.demo} className="architecture-demo">
                            <Fade>
                                <Lottie
                                    options={{
                                        loop: true, autoplay: true, animationData: animationData, renderer: 'svg'
                                    }}
                                />
                            </Fade>
                        </div>
                        <div
                            ref={this.column2}
                            className="library-cards-column-2"
                            style={{cursor: this.state.clickCount < 5 ? 'pointer' : 'default'}}
                            onClick={() => {
                                this.setState({clickCount: this.state.clickCount + 1});
                            }}
                        >
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 1}>
                                    <LibraryCard
                                        name="Express.js"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_9.png"
                                        content="Provide API endpoints for GET, PUT, POST, DELETE requests of art information. Connected with Aurora and S3 to update databases."
                                    />
                                </Fade>
                            </div>
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 3}>
                                    <LibraryCard
                                        name="Kafka"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_20.png"
                                        content="Message queue and CDC tool to capture database change and update Microservices in real time."
                                    />
                                </Fade>
                            </div>
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 4}>
                                    <LibraryCard
                                        name="ElasticSearch"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_7.png"
                                        content="Multilingual Text Search Engine and Image Signature Search Engine."
                                    />
                                </Fade>
                            </div>
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 4}>
                                    <LibraryCard
                                        name="TensorFlow"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_6.png"
                                        content="Machine learning model for Recommender System."
                                    />
                                </Fade>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        <div className="architecture-demo-mobile">
                            <Fade>
                                <Lottie
                                    options={{
                                        loop: true, autoplay: true, animationData: animationData, renderer: 'svg'
                                    }}
                                />
                            </Fade>
                        </div>
                        <div
                            className="library-cards-mobile"
                            style={{cursor: this.state.clickCount < 5 ? 'pointer' : 'default'}}
                            onClick={() => {
                                this.setState({clickCount: this.state.clickCount + 1});
                            }}
                        >
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 0}>
                                    <LibraryCard
                                        name="Nginx"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_21.png"
                                        content="Load balancer to redirect requests to multiple API servers."
                                    />
                                </Fade>
                            </div>
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 1}>
                                    <LibraryCard
                                        name="Express.js"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_9.png"
                                        content="Provide API endpoints for GET, PUT, POST, DELETE requests of art information. Connected with Aurora and S3 to update databases."
                                    />
                                </Fade>
                            </div>
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 2}>
                                    <LibraryCard
                                        name="Amazon Aurora"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_22.png"
                                        content="Information of artworks, artist, museums, genres, etc. and users, as well as relationship between items including painting, collecting, exhibiting, etc."
                                    />
                                </Fade>
                            </div>
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 2}>
                                    <LibraryCard
                                        name="Amazon S3"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_3.png"
                                        content="Raw image of artworks and static image content of the website."
                                    />
                                </Fade>
                            </div>
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 3}>
                                    <LibraryCard
                                        name="Kafka"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_20.png"
                                        content="Message queue and CDC tool to capture database change and update Microservices in real time."
                                    />
                                </Fade>
                            </div>
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 4}>
                                    <LibraryCard
                                        name="ElasticSearch"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_7.png"
                                        content="Multilingual Text Search Engine and Image Signature Search Engine."
                                    />
                                </Fade>
                            </div>
                            <div className="library-card-item">
                                <Fade bottom when={this.state.clickCount > 4}>
                                    <LibraryCard
                                        name="TensorFlow"
                                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/architecture/img_6.png"
                                        content="Machine learning model for Recommender System."
                                    />
                                </Fade>
                            </div>
                        </div>
                    </div>}

                <Footer windowWidth={this.state.windowWidth} windowHeight={this.state.windowHeight}/>
            </div>
        );
    }
}

export default Home;
