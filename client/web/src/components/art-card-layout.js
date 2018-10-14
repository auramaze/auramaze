import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Scrollbars} from 'react-custom-scrollbars';
import ArtizenCard from './artizen-card';
import ArtCard from './art-card';
import SectionTitle from './section-title';
import './art-card-layout.css';

class ArtCardLayout extends Component {
    constructor(props) {
        super(props);
        let heights = [];
        let images = [];
        for (let i = 0; i < props.columns; i++) {
            heights.push(0);
            images.push([]);
        }
        this.state = {
            columns: props.columns,
            heights: heights,
            images: images
        };
    }

    static getMinIndex(arr) {
        return arr.indexOf(Math.min(...arr));
    }

    static getArtWidth(art) {
        return art.image.default.width;
    }

    static getArtHeight(art) {
        return art.image.default.height;
    }

    static appendArts(arts, prevState) {
        let nextState = JSON.parse(JSON.stringify(prevState));
        for (let art of arts) {
            const minIndex = ArtCardLayout.getMinIndex(nextState.heights);
            nextState.heights[minIndex] += ArtCardLayout.getArtHeight(art) / ArtCardLayout.getArtWidth(art);
            nextState.images[minIndex].push(art);
        }
        return nextState;
    }

    static resetArts(arts, columns) {
        let heights = [];
        let images = [];
        for (let i = 0; i < columns; i++) {
            heights.push(0);
            images.push([]);
        }
        let nextState = {
            columns: columns,
            heights: heights,
            images: images
        };

        return ArtCardLayout.appendArts(arts, nextState);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.columns !== prevState.columns) {
            return ArtCardLayout.resetArts(nextProps.arts, nextProps.columns);
        } else {
            let imageSum = prevState.images.reduce((acc, cur) => acc + cur.length, 0);
            return ArtCardLayout.appendArts(nextProps.arts.slice(imageSum), prevState);
        }
    }

    render() {
        return (
            this.state.images.map((column, index) =>
                <div
                    key={index}
                    style={{display: 'inline-block', verticalAlign: 'top'}}
                >
                    {
                        column.map((art, index) =>
                            <ArtCard
                                key={index}
                                style={{width: 250}}
                                image={art.image.default.url}
                                artist={art.artist.default}
                                completionYear={art.completion_year}
                                title={art.title.default}
                                avatar={art.avatar}
                                abstract={art.introduction && art.introduction.length > 0 && art.introduction[0].en}
                            />)
                    }

                </div>
            )
        );
    }
}

export default ArtCardLayout;