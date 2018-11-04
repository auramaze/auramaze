import React from 'react';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} from 'react-google-maps';

const MapWithAMarker = withScriptjs(withGoogleMap(props =>
    <GoogleMap
        defaultZoom={14}
        defaultCenter={props.position}
    >
        <Marker
            position={props.position}
        />
    </GoogleMap>
));

export default MapWithAMarker;
