import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withCookies} from 'react-cookie';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import request from 'request';
import {injectIntl} from "react-intl";
import ArtizenHeader from './artizen-header';
import SectionTitle from '../components/section-title';
import ArtCardLayout from '../components/art-card-layout';
import TextCard from '../components/text-card';
import SlickPrevArror from '../components/slick-prev-arrow';
import SlickNextArror from '../components/slick-next-arrow';
import {API_ENDPOINT} from '../common';
import EditorModal from "../components/editor-modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {LanguageContext, VoteContext} from '../app';
import {getLocaleValue} from '../utils';
import './artizen.css';

class Artizen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artizen: {},
            arts: [],
            introductions: [],
            reviews: [],
            editModalShow: false
        };
        this.artSection = React.createRef();
        this.updateArtizen = this.updateArtizen.bind(this);
    }

    componentDidMount() {
        this.updateArtizen(this.props.match.params.artizenId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.artizenId !== this.props.match.params.artizenId) {
            this.updateArtizen(this.props.match.params.artizenId);
        }
    }

    updateArtizen(artizenId) {
        const token = this.props.cookies.get('token');
        const {vote, updateVote} = this.props;

        this.setState({
            artizen: {},
            arts: [],
            introductions: [],
            reviews: []
        });
        request.get({
            url: `${API_ENDPOINT}/artizen/${artizenId}`,
            headers: token && {
                'Authorization': `Bearer ${token}`
            },
            json: true
        }, (error, response, artizen) => {
            if (response && response.statusCode === 200) {
                this.setState({artizen: artizen});
                const id = artizen.id;
                if (id) {
                    request.get({
                        url: `${API_ENDPOINT}/artizen/${id}/art`,
                        json: true
                    }, (error, response, body) => {
                        if (response && response.statusCode === 200) {
                            // // Filter arts with image
                            // body.forEach(section => {
                            //     section.data = section.data.filter(art => art.image);
                            // });
                            this.setState({arts: body});
                        }
                    });

                    request.get({
                        url: `${API_ENDPOINT}/artizen/${id}/introduction`,
                        headers: token && {
                            'Authorization': `Bearer ${token}`
                        },
                        json: true
                    }, (error, response, introductions) => {
                        if (response && response.statusCode === 200) {
                            const newVote = introductions.reduce((acc, cur) => {
                                acc[cur.id] = (({up, down, status}) => ({up, down, status}))(cur);
                                return acc;
                            }, {});
                            updateVote(Object.assign(vote, newVote));
                            this.setState({introductions: introductions});
                        }
                    });

                    request.get({
                        url: `${API_ENDPOINT}/artizen/${id}/review`,
                        headers: token && {
                            'Authorization': `Bearer ${token}`
                        },
                        json: true
                    }, (error, response, reviews) => {
                        if (response && response.statusCode === 200) {
                            const newVote = reviews.reduce((acc, cur) => {
                                acc[cur.id] = (({up, down, status}) => ({up, down, status}))(cur);
                                return acc;
                            }, {});
                            updateVote(Object.assign(vote, newVote));
                            this.setState({reviews: reviews});
                        }
                    });
                }
            }
        });
    }

    static convertArtizenTypeToSectionTitle(artizenType) {
        const artizenTypeToSectionTitle = {
            'artist': 'Artworks',
            'museum': 'Collections',
            'exhibition': 'Exhibits',
            'genre': 'Related Arts',
            'style': 'Related Arts'
        };
        return artizenTypeToSectionTitle[artizenType];
    }

    getArtCardLayoutColumns() {
        return Math.max(Math.floor(this.artSection.current.clientWidth / 250), 1);
    }

    getArtCardLayoutWidth() {
        return this.artSection.current.clientWidth - 40;
    }

    render() {
        const {intl} = this.props;
        return (<LanguageContext.Consumer>
                {({language}) => (
                    <div className="artizen">
                        <div className="artizen-left-section">
                            <ArtizenHeader
                                id={this.state.artizen.id}
                                name={getLocaleValue(this.state.artizen.name, language)}
                                avatar={this.state.artizen.avatar}
                                type={this.state.artizen.type}
                                following={this.state.artizen.following}
                            />
                            <SectionTitle sectionTitle={intl.formatMessage({id: 'app.artizen.introductions'})}/>
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
                                                authorName={getLocaleValue(introduction.author_name, language)}
                                                authorAvatar={introduction.author_avatar}
                                                itemType="artizen"
                                                itemId={introduction.artizen_id}
                                                itemUsername={introduction.artizen_username}
                                                textType="introduction"
                                                textId={introduction.id}
                                                content={introduction.content}
                                                up={introduction.up}
                                                down={introduction.down}
                                                status={introduction.status}
                                            />
                                        </div>)}
                                </Slider>}
                            </div>
                            <SectionTitle sectionTitle={intl.formatMessage({id: 'app.artizen.reviews'})}>
                                <FontAwesomeIcon icon={faEdit} size="20" style={{cursor: 'pointer'}} onClick={() => {
                                    this.setState({editModalShow: true});
                                }}/>
                            </SectionTitle>
                            {this.state.reviews.map(review =>
                                <TextCard
                                    key={review.id}
                                    style={{margin: 20}}
                                    authorId={review.author_id}
                                    authorUsername={review.author_username}
                                    authorName={getLocaleValue(review.author_name, language)}
                                    authorAvatar={review.author_avatar}
                                    itemType="artizen"
                                    itemId={review.artizen_id}
                                    itemUsername={review.artizen_username}
                                    textType="review"
                                    textId={review.id}
                                    rating={review.rating}
                                    content={review.content}
                                    up={review.up}
                                    down={review.down}
                                    status={review.status}
                                />)}
                        </div>
                        <div className="artizen-right-section" ref={this.artSection}>
                            {this.state.arts.map(section => section.data.length > 0 &&
                                <div key={section.type}>
                                    <SectionTitle
                                        sectionTitle={intl.formatMessage({id: `app.artizen.${section.type}`})}/>
                                    <ArtCardLayout
                                        arts={section.data}
                                        width={this.getArtCardLayoutWidth()}
                                        columns={this.getArtCardLayoutColumns()}
                                    />
                                </div>
                            )}
                        </div>
                        <EditorModal show={this.state.editModalShow} handleClose={() => {
                            this.setState({editModalShow: false})
                        }} itemType="artizen" itemId={this.state.artizen.id} itemName={this.state.artizen.name}
                                     textType="review"/>
                    </div>)}
            </LanguageContext.Consumer>
        );
    }
}

Artizen.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            artizenId: PropTypes.string
        })
    }),
};

export default withCookies(injectIntl(React.forwardRef((props, ref) => (
    <VoteContext.Consumer>
        {({vote, updateVote}) => <Artizen {...props} vote={vote} updateVote={updateVote} ref={ref}/>}
    </VoteContext.Consumer>)
)));
