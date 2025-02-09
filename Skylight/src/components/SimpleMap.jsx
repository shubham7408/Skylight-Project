import React from 'react';
import { Map } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2F1cmFiaHBhdGlsMTcyMTk5OSIsImEiOiJjbTBvMm9kbDQwNGc5Mmxxc3gxdG9kdjZtIn0.y0md-sfeNDrW8dDpDOPP2g';

const SimpleMap = () => {
  return (
    <Map
      mapStyle="mapbox://styles/mapbox/light-v10"
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{ width: '100%', height: '100%' }}
      initialViewState={{
        longitude: 78.9629,
        latitude: 20.5937,
        zoom: 4,
        pitch: 45,
        bearing: 0,
      }}
    />
  );
};

export default SimpleMap;
