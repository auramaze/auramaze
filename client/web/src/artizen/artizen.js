import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import request from 'request';
import ArtizenHeader from './artizen-header';
import SectionTitle from '../components/section-title';
import ArtCardLayout from '../components/art-card-layout';
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
                        style={{backgroundColor: '#fafafa'}}
                        type={this.state.artizen.type}
                    />
                    <SectionTitle sectionTitle="Reviews"/>
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
