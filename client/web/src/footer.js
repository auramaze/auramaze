import React, {Component} from 'react';
import MapWithAMarker from './map-with-marker';
import logo from './logo-white-frame.svg';
import './footer.css';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wideScreen: document.documentElement.clientWidth > 768
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            wideScreen: document.documentElement.clientWidth > 768
        });
    }

    render() {
        return (
            <div className="footer" id="contact">
                <table>
                    <tbody>
                        <tr>
                            {this.state.wideScreen &&
                        <td width="10%">
                            <img src={logo} className="logo-footer" alt="logo"/>
                        </td>}
                            <td width={this.state.wideScreen ? '45%' : '80%'}>
                                <div className="contact-info">
                                Email: <br/><a href="mailto:service@auramaze.org">service@auramaze.org</a><br/>Address:
                                    <br/>1760 Broadway St.<br/>Ann Arbor, MI 48105
                                </div>
                            </td>
                            {this.state.wideScreen &&
                        <td width="45%">
                            <MapWithAMarker
                                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                                position={{lat: 42.297, lng: -83.721}}
                                loadingElement={<div style={{height: '100%'}}/>}
                                containerElement={<div style={{height: '300px'}}/>}
                                mapElement={<div style={{height: '100%'}}/>}
                            />
                        </td>}
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Footer;
