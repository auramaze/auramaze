import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Scrollbars} from 'react-custom-scrollbars';
import ArtizenCard from './artizen-card';
import ArtCardLayout from './art-card-layout';
import SectionTitle from './section-title';
import './item-list.css';

class ItemList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arts: props.items.art
        };
    }

    componentDidUpdate() {
        setTimeout(function() {
            this.setState({arts: [...this.state.arts, ...this.props.items.art]});
        }.bind(this), 2000);
    }

    render() {
        return (
            <div className="item-list">
                <div className="item-list-container">
                    {this.props.items.artizen && this.props.items.artizen.length > 0 &&
                    <div className="artizen-section">
                        <SectionTitle sectionTitle="Artizen" style={{margin: '30px 20px 10px 20px'}}/>
                        <div className="scrollbar-container">
                            <Scrollbars style={{width: '100%', height: '100%'}}>
                                <div className="artizen-container">
                                    {this.props.items.artizen.map((artizen, index) =>
                                        <ArtizenCard
                                            key={index}
                                            style={{
                                                width: 280,
                                                display: 'inline-block',
                                                margin: 20,
                                                verticalAlign: 'top'
                                            }}
                                            name={artizen.name.default}
                                            avatar={artizen.avatar}
                                            abstract={artizen.introduction && artizen.introduction.length > 0 && artizen.introduction[0].en}
                                        />)}
                                </div>
                            </Scrollbars>
                            <div className="artizen-container-mask-left"/>
                            <div className="artizen-container-mask-right"/>
                        </div>
                    </div>}
                    {this.props.items.art && this.props.items.art.length > 0 &&
                    <div className="art-section">
                        <SectionTitle sectionTitle="Art" style={{margin: '30px 20px 10px 20px'}}/>
                        <ArtCardLayout arts={this.state.arts} columns={2}/>
                    </div>}
                </div>
            </div>
        );
    }
}

ItemList.propTypes = {
    items: PropTypes.object,
};

export default ItemList;
