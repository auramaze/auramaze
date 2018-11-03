import React, {Component} from 'react';
import PropTypes from 'prop-types';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import request from 'request';
import SectionTitle from '../components/section-title';
import ArtizenCard from '../components/artizen-card';
import TextCard from '../components/text-card';
import SlickPrevArror from '../components/slick-prev-arrow';
import SlickNextArror from '../components/slick-next-arrow';
import {API_ENDPOINT} from '../common';
import './art.css';

class Art extends Component {
    constructor(props) {
        super(props);
        this.state = {
            art: {},
            artizens: [],
            introductions: [],
            reviews: []
        };
        this.artSection = React.createRef();
        this.updateArt = this.updateArt.bind(this);
    }

    componentDidMount() {
        this.updateArt(this.props.match.params.artId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.artId !== this.props.match.params.artId) {
            this.updateArt(this.props.match.params.artId);
        }
    }

    updateArt(artId) {
        this.setState({
            art: {},
            artizens: [],
            introductions: [],
            reviews: []
        });
        request.get({
            url: `${API_ENDPOINT}/art/${artId}`,
            json: true
        }, (error, response, art) => {
            if (response && response.statusCode === 200) {
                this.setState({art: art});
                const id = art.id;
                if (id) {
                    request.get({
                        url: `${API_ENDPOINT}/art/${id}/artizen`,
                        json: true
                    }, (error, response, body) => {
                        if (response && response.statusCode === 200) {
                            this.setState({artizens: body});
                        }
                    });

                    request.get({
                        url: `${API_ENDPOINT}/art/${id}/introduction`,
                        json: true
                    }, (error, response, introductions) => {
                        if (response && response.statusCode === 200) {
                            this.setState({introductions: introductions});
                        }
                    });

                    request.get({
                        url: `${API_ENDPOINT}/art/${id}/review`,
                        json: true
                    }, (error, response, reviews) => {
                        if (response && response.statusCode === 200) {
                            this.setState({reviews: reviews});
                        }
                    });
                }
            }
        });
    }

    static convertArtizenTypeToSectionTitle(artizenType) {
        return artizenType.charAt(0).toUpperCase() + artizenType.slice(1);
    }

    getArtImageWidth() {
        return this.artSection.current ? this.artSection.current.clientWidth / 2 : 0;
    }

    render() {
        return (
            <div className="art">
                <div className="art-right-section" ref={this.artSection}>
                    <div className="art-title">{this.state.art.title && this.state.art.title.default}</div>
                    <div className="art-image-container">
                        <img src={this.state.art.image && this.state.art.image.default.url} alt="image"/>
                    </div>
                    <SectionTitle sectionTitle="Introductions"/>
                    <div className="slider-container">
                        {this.state.introductions.length > 0 &&
                        <Slider
                            dots
                            infinite
                            speed={500}
                            slidesToShow={1}
                            slidesToScroll={1}
                            prevArrow={<SlickPrevArror/>}
                            nextArrow={<SlickNextArror/>}
                        >
                            {this.state.introductions.map(introduction =>
                                <div className="slide-container" key={introduction.id}>
                                    <TextCard
                                        key={introduction.id}
                                        authorId={introduction.author_id}
                                        authorUsername={introduction.author_username}
                                        authorName={introduction.author_name && introduction.author_name.default}
                                        authorAvatar={introduction.author_avatar}
                                        itemType="art"
                                        itemId={introduction.art_id}
                                        textType="introduction"
                                        textId={introduction.id}
                                        content={introduction.content}
                                        up={introduction.up}
                                        down={introduction.down}
                                    />
                                </div>)}
                        </Slider>}
                    </div>
                </div>
                <div className="art-left-section">
                    {this.state.artizens.map(section => section.data.length > 0 &&
                        <div key={section.type}>
                            <SectionTitle sectionTitle={Art.convertArtizenTypeToSectionTitle(section.type)}/>
                            {section.data.map(artizen =>
                                <ArtizenCard
                                    key={artizen.id}
                                    id={artizen.id}
                                    username={artizen.username}
                                    name={artizen.name && artizen.name.default}
                                    avatar={artizen.avatar}
                                    extended={false}
                                    style={{margin: 20}}
                                />)}
                        </div>
                    )}
                    <SectionTitle sectionTitle="Reviews"/>
                    {this.state.reviews.map(review =>
                        <TextCard
                            key={review.id}
                            style={{margin: 20}}
                            authorId={review.author_id}
                            authorUsername={review.author_username}
                            authorName={review.author_name && review.author_name.default}
                            authorAvatar={review.author_avatar}
                            itemType="art"
                            itemId={review.art_id}
                            textType="review"
                            textId={review.id}
                            rating={review.rating}
                            content={review.content}
                            up={review.up}
                            down={review.down}
                        />)}
                </div>
            </div>
        );
    }
}

Art.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            artId: PropTypes.string
        })
    }),
};

export default Art;
