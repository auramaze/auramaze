import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ArtCard from './art-card';
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
        return art.image ? art.image.default.width : 1;
    }

    static getArtHeight(art) {
        return art.image ? art.image.default.height : 0;
    }

    static appendArts(arts, prevState, artCardWidth, extendedHeight) {
        let nextState = prevState;
        for (let art of arts) {
            const minIndex = ArtCardLayout.getMinIndex(nextState.heights);
            nextState.heights[minIndex] += (ArtCardLayout.getArtHeight(art) / ArtCardLayout.getArtWidth(art) * artCardWidth + extendedHeight);
            nextState.images[minIndex].push(art);
        }
        return nextState;
    }

    static resetArts(arts, columns, artCardWidth, extendedHeight) {
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

        return ArtCardLayout.appendArts(arts, nextState, artCardWidth, extendedHeight);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.columns !== prevState.columns) {
            return ArtCardLayout.resetArts(nextProps.arts, nextProps.columns, ArtCardLayout.getArtCardWidth(nextProps.width, nextProps.columns), nextProps.extended ? 250 : 80);
        } else {
            let imageSum = prevState.images.reduce((acc, cur) => acc + cur.length, 0);
            return ArtCardLayout.appendArts(nextProps.arts.slice(imageSum), prevState, ArtCardLayout.getArtCardWidth(nextProps.width, nextProps.columns), nextProps.extended ? 250 : 80);
        }
    }

    static getArtCardWidth(width, columns) {
        return Math.floor((width - 40 * columns) / columns);
    }

    render() {
        return (
            <div style={{whiteSpace: 'nowrap', width: this.props.width, overflowX: 'hidden'}}>
                {this.state.images.map((column, index) =>
                    <div
                        key={index}
                        style={{display: 'inline-block', verticalAlign: 'top'}}
                    >
                        {
                            column.map((art, index) =>
                                <ArtCard
                                    key={index}
                                    style={{
                                        width: ArtCardLayout.getArtCardWidth(this.props.width, this.props.columns),
                                        margin: 20
                                    }}
                                    id={art.id}
                                    image={art.image && art.image.default.url}
                                    artist={art.artist && art.artist.default}
                                    completionYear={art.completion_year}
                                    title={art.title && art.title.default}
                                    avatar={art.avatar}
                                    abstract={JSON.stringify(art._highlight) || ''}
                                    extended={this.props.extended}
                                />
                            )
                        }

                    </div>
                )}
            </div>
        );
    }
}

ArtCardLayout.propTypes = {
    arts: PropTypes.array,
    width: PropTypes.number,
    columns: PropTypes.number,
    extended: PropTypes.bool
};

export default ArtCardLayout;
