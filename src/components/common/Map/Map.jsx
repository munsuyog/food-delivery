import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const MapContainer = ({ location, onLocationChange }) => {
  const mapStyles = {
    height: '400px',
    width: '100%'
  };

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchBox, setSearchBox] = useState(null); // State to hold the search box instance

  useEffect(() => {
    setSelectedLocation(location);
  }, [location]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latLng.toJSON();
    setSelectedLocation({ lat, lng });
    onLocationChange({ lat, lng });
  };

  const handlePlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places.length > 0) {
        const { lat, lng } = places[0].geometry.location.toJSON();
        setSelectedLocation({ lat, lng });
        onLocationChange({ lat, lng });
      }
    }
  };

  const handleSearchBoxLoad = (ref) => {
    setSearchBox(ref); // Save the search box instance to state
  };

  return (
    <LoadScript 
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}
      libraries={['places']}
    >
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={10}
        center={selectedLocation || { lat: 0, lng: 0 }}
        onClick={handleMapClick}
      >
        <StandaloneSearchBox
          onLoad={handleSearchBoxLoad} // Call handleSearchBoxLoad when the search box loads
          onPlacesChanged={handlePlacesChanged}
        >
          <input
            type="text"
            placeholder="Search..."
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              marginLeft: "-120px"
            }}
          />
        </StandaloneSearchBox>
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
