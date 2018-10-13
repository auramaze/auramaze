import React, {Component} from 'react';
import ArtizenCard from '../components/artizen-card';
import SectionTitle from '../components/section-title';
import './search.css';

class Search extends Component {
    render() {
        return (
            <div>
                <div className="result-list">
                    <div className="result-list-container">
                        <SectionTitle sectionTitle="Artizen" style={{margin: '50px 20px 10px 20px'}}/>
                        <div className="result-artizen-container">
                            <ArtizenCard
                                style={{width: 250, display: 'inline-block', margin: 20}}
                                avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/paul-cezanne.jpg"
                                abstract="Paul Cézanne (US: /seɪˈzæn/ or UK: /sɪˈzæn/; French: [pɔl sezan]; 19 January 1839 – 22 October 1906) was a French artist and Post-Impressionist painter whose work laid the foundations of the transition from the 19th-century conception of artistic endeavor to a new and radically different world of art in the 20th century. "
                            />
                            <ArtizenCard
                                style={{width: 250, display: 'inline-block', margin: 20}}
                                avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/paul-cezanne.jpg"
                                abstract="Paul Cézanne (US: /seɪˈzæn/ or UK: /sɪˈzæn/; French: [pɔl sezan]; 19 January 1839 – 22 October 1906) was a French artist and Post-Impressionist painter whose work laid the foundations of the transition from the 19th-century conception of artistic endeavor to a new and radically different world of art in the 20th century. "
                            />
                            <ArtizenCard
                                style={{width: 250, display: 'inline-block', margin: 20}}
                                avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/paul-cezanne.jpg"
                                abstract="Paul Cézanne (US: /seɪˈzæn/ or UK: /sɪˈzæn/; French: [pɔl sezan]; 19 January 1839 – 22 October 1906) was a French artist and Post-Impressionist painter whose work laid the foundations of the transition from the 19th-century conception of artistic endeavor to a new and radically different world of art in the 20th century. "
                            />
                            <ArtizenCard
                                style={{width: 250, display: 'inline-block', margin: 20}}
                                avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/paul-cezanne.jpg"
                                abstract="Paul Cézanne (US: /seɪˈzæn/ or UK: /sɪˈzæn/; French: [pɔl sezan]; 19 January 1839 – 22 October 1906) was a French artist and Post-Impressionist painter whose work laid the foundations of the transition from the 19th-century conception of artistic endeavor to a new and radically different world of art in the 20th century. "
                            />
                            <ArtizenCard
                                style={{width: 250, display: 'inline-block', margin: 20}}
                                avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/paul-cezanne.jpg"
                                abstract="Paul Cézanne (US: /seɪˈzæn/ or UK: /sɪˈzæn/; French: [pɔl sezan]; 19 January 1839 – 22 October 1906) was a French artist and Post-Impressionist painter whose work laid the foundations of the transition from the 19th-century conception of artistic endeavor to a new and radically different world of art in the 20th century. "
                            />
                            <ArtizenCard
                                style={{width: 250, display: 'inline-block', margin: 20}}
                                avatar="https://s3.us-east-2.amazonaws.com/auramaze-test/avatar/paul-cezanne.jpg"
                                abstract="Paul Cézanne (US: /seɪˈzæn/ or UK: /sɪˈzæn/; French: [pɔl sezan]; 19 January 1839 – 22 October 1906) was a French artist and Post-Impressionist painter whose work laid the foundations of the transition from the 19th-century conception of artistic endeavor to a new and radically different world of art in the 20th century. "
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Search;
