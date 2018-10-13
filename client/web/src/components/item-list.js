import React, {Component} from 'react';
import {Scrollbars} from 'react-custom-scrollbars';
import ArtizenCard from './artizen-card';
import SectionTitle from './section-title';
import './item-list.css';

class ItemList extends Component {
    render() {
        return (
            <div className="item-list">
                <div className="item-list-container">
                    <SectionTitle sectionTitle="Artizen" style={{margin: '50px 20px 10px 20px'}}/>
                    <div className="scrollbar-container">
                        <Scrollbars style={{width: '100%', height: '100%'}}>
                            <div className="artizen-container">
                                {this.props.items.artizen.map((artizen, index) =>
                                    <ArtizenCard
                                        key={index}
                                        style={{width: 300, display: 'inline-block', margin: 20}}
                                        name={artizen.name.default}
                                        avatar={artizen.avatar}
                                        abstract={artizen.introduction[0].en}
                                    />)}
                            </div>
                        </Scrollbars>
                        <div className="artizen-container-mask-left"/>
                        <div className="artizen-container-mask-right"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default ItemList;
