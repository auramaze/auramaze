import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import request from 'request';
import ArtizenHeader from './artizen-header';
import SectionTitle from '../components/section-title';
import ArtCardLayout from '../components/art-card-layout';
import TextCard from '../components/text-card';
import SlickPrevArror from '../components/slick-prev-arrow';
import SlickNextArror from '../components/slick-next-arrow';
import {API_ENDPOINT} from '../common';
import './artizen.css';

class Artizen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artizen: {},
            art: []
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
        request.get({
            url: `${API_ENDPOINT}/artizen/${artizenId}`,
            json: true
        }, (error, response, body) => {
            if (response && response.statusCode === 200) {
                this.setState({artizen: body});
                request.get({
                    url: `${API_ENDPOINT}/artizen/${artizenId}/art`,
                    json: true
                }, (error, response, body) => {
                    if (response && response.statusCode === 200) {
                        // Filter arts with image
                        body.forEach(section => {
                            section.data = section.data.filter(art => art.image);
                        });
                        this.setState({art: body});
                    }
                });
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
        return Math.max(Math.floor(this.artSection.current.offsetWidth / 250), 2);
    }

    getArtCardLayoutWidth() {
        return this.artSection.current.offsetWidth - 40;
    }

    render() {
        return (
            <div className="artizen">
                <div className="artizen-left-section">
                    <ArtizenHeader
                        name={this.state.artizen.name && this.state.artizen.name.default}
                        avatar={this.state.artizen.avatar}
                        type={this.state.artizen.type}
                    />
                    <SectionTitle sectionTitle="Introductions"/>
                    <div className="slider-container">
                        <Slider
                            dots
                            infinite
                            speed={500}
                            slidesToShow={1}
                            slidesToScroll={1}
                            prevArrow={<SlickPrevArror/>}
                            nextArrow={<SlickNextArror/>}
                        >
                            <div className="slide-container">
                                <TextCard
                                    key="1000000003"
                                    authorId="100000011"
                                    authorUsername="metmuseum"
                                    authorName="Metropolitan Museum of Art (Met), New York City, NY, US"
                                    avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/metmuseum.png"
                                    itemType="artizen"
                                    itemId="100204915"
                                    itemUsername="vincent-van-gogh"
                                    textType="introduction"
                                    textId="1000000003"
                                    content="Vincent Willem van Gogh (Dutch: [ˈvɪnsɛnt ˈʋɪləm vɑŋ ˈɣɔx] (About this sound listen);[note 1] 30 March 1853 – 29 July 1890) was a Dutch Post-Impressionist painter who is among the most famous and influential figures in the history of Western art. In just over a decade he created about 2,100 artworks, including around 860 oil paintings, most of them in the last two years of his life. They include landscapes, still lifes, portraits and self-portraits, and are characterised by bold colours and dramatic, impulsive and expressive brushwork that contributed to the foundations of modern art. His suicide at 37 followed years of mental illness and poverty."
                                    likes={666}
                                    dislikes={222}
                                    status={1}
                                />
                            </div>
                            <div className="slide-container">
                                <TextCard
                                    key="1000000004"
                                    authorId="100000011"
                                    authorUsername="metmuseum"
                                    authorName="Metropolitan Museum of Art (Met), New York City, NY, US"
                                    avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/metmuseum.png"
                                    itemType="artizen"
                                    itemId="100204915"
                                    itemUsername="vincent-van-gogh"
                                    textType="introduction"
                                    textId="1000000004"
                                    content="文森特·威廉·梵高（荷兰语：Vincent Willem van Gogh 荷兰语读音：[ˈvɪnsɛnt ˈʋɪləm vɑn ˈɣɔx]  聆听;[注 1]，1853年3月30日－1890年7月29日），荷兰后印象派画家。他是表现主义的先驱，并深深影响了二十世纪艺术，尤其是野兽派与德国表现主义。梵高的作品，如《星夜》、《向日葵》、《有乌鸦的麦田》等，现已跻身于全球最具名、广为人知的艺术作品的行列。他在2004年票选最伟大的荷兰人当中，排名第十，次于第九伟大的17世纪画家林布兰。"
                                    likes={666}
                                    dislikes={222}
                                    status={-1}
                                />
                            </div>
                        </Slider>
                    </div>
                    <SectionTitle sectionTitle="Reviews"/>
                    <TextCard
                        key="1000000001"
                        style={{margin: 20}}
                        authorId="100000011"
                        authorUsername="metmuseum"
                        authorName="Metropolitan Museum of Art (Met), New York City, NY, US"
                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/metmuseum.png"
                        itemType="artizen"
                        itemId="100204915"
                        itemUsername="vincent-van-gogh"
                        textType="review"
                        textId="1000000001"
                        content="说来惭愧，真正意识到梵高的伟大是在自己得了精神疾病以后。虽然以前去过好几个收录了梵高作品的博物馆，却没有感受到强烈的冲击。直到后来得了严重的抑郁症，每天需要吃药才有感触。有一个夏天的晚上吃完某种安定情绪的药物后产生了幻觉，当我看到窗外稀疏的星星时，星星就像《星空》中的一样旋转跳跃起来，甚至涌向我。第一时间我想到了梵高，感动得留下了眼泪，由于吃药我已经很久没有哭了。这种感觉不是悲伤也不是孤独，而是理解。世界上形形色色的人当中总有一些孤独的灵魂，而孤独的灵魂也可以有强烈的共鸣，虽然我们不是一个时代的人。"
                        likes={666}
                        dislikes={222}
                        status={1}
                    />
                    <TextCard
                        key="1000000002"
                        style={{margin: 20}}
                        authorId="100000011"
                        authorUsername="metmuseum"
                        authorName="Metropolitan Museum of Art (Met), New York City, NY, US"
                        avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/metmuseum.png"
                        itemType="artizen"
                        itemId="100204915"
                        itemUsername="vincent-van-gogh"
                        textType="review"
                        textId="1000000002"
                        content="Speaking of it, I really realized that Van Gogh’s greatness was after I had a mental illness. Although I have been to several museums that have included Van Gogh's works before, I have not felt a strong impact. Until I got a serious depression, I needed to take medicine every day to feel it. "
                        likes={666}
                        dislikes={222}
                        status={-1}
                    />
                </div>
                <div className="artizen-right-section" ref={this.artSection}>
                    {this.state.art.map(section => section.data.length > 0 &&
                        <div key={section.type}>
                            <SectionTitle sectionTitle={Artizen.convertArtizenTypeToSectionTitle(section.type)}/>
                            <ArtCardLayout
                                arts={section.data}
                                width={this.getArtCardLayoutWidth()}
                                columns={this.getArtCardLayoutColumns()}
                            />
                        </div>
                    )}
                </div>
            </div>
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

export default Artizen;
