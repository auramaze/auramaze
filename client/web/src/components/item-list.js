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
        this.itemList = React.createRef();
    }

    getArtCardLayoutColumns() {
        return Math.max(Math.floor(this.itemList.current.offsetWidth / 320), 1);
    }

    getArtCardLayoutWidth() {
        return this.itemList.current.offsetWidth;
    }

    render() {
        return (
            <div className="item-list" ref={this.itemList}>
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
                                            id={artizen.id}
                                            username={artizen.username}
                                            name={artizen.name.default}
                                            avatar={artizen.avatar}
                                            abstract={artizen.introduction && artizen.introduction.length > 0 && artizen.introduction[0].en}
                                            extended={this.props.extended}
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
                        <ArtCardLayout
                            arts={this.props.items.art}
                            columns={this.getArtCardLayoutColumns()}
                            width={this.getArtCardLayoutWidth()}
                            extended={this.props.extended}
                        />
                    </div>}
                </div>
            </div>
        );
    }
}

ItemList.propTypes = {
    items: PropTypes.object,
    extended: PropTypes.bool
};

export default ItemList;
