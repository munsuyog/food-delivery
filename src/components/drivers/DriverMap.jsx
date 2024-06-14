import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Button } from '../ui/button';

const DriverMap = ({ customerLocation, restaurantLocation }) => {
  const mapStyles = {
    height: '400px',
    width: '100%'
  };

  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

  const restaurantIcon = 'path/to/restaurant-icon.png';
  const customerIcon = 'path/to/customer-icon.png';

  const getNavigationUrl = (destination) => {
    if (!currentPosition || !destination) return '#';
    const { lat, lng } = currentPosition;
    return `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
  };

  // Check if customerLocation and restaurantLocation are defined
  if (!customerLocation || !restaurantLocation) {
    return <div>Loading...</div>;
  }

  const customerPosition = { lat: customerLocation.latitude, lng: customerLocation.longitude };
  const restaurantPosition = restaurantLocation;

  // Custom marker icons (using Google Maps default markers with different colors)
  const driverMarkerOptions = {
    position: currentPosition,
    icon: {
      url: `https://maps.google.com/mapfiles/ms/icons/blue-dot.png`, // Blue dot for driver
    },
    label: 'Driver',
  };

  const restaurantMarkerOptions = {
    position: restaurantPosition,
    icon: {
      url: `https://maps.google.com/mapfiles/ms/icons/red-dot.png`, // Red dot for restaurant
    },
    label: 'Restaurant',
  };

  const customerMarkerOptions = {
    position: customerPosition,
    icon: {
      url: `https://maps.google.com/mapfiles/ms/icons/green-dot.png`, // Green dot for customer
    },
    label: 'Customer',
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}>
      <div>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={10}
          center={currentPosition || { lat: 0, lng: 0 }}
        >
          {currentPosition && <Marker {...driverMarkerOptions} />}
          <Marker {...restaurantMarkerOptions} />
          <Marker {...customerMarkerOptions} />
        </GoogleMap>
        <div className='flex gap-2 mt-2 mb-2 items-center'>
          <h4>Navigate: </h4>
          <Button onClick={() => window.open(getNavigationUrl(restaurantPosition), '_blank')}>
            Navigate to Restaurant
          </Button>
          <Button onClick={() => window.open(getNavigationUrl(customerPosition), '_blank')}>
            Navigate to Customer
          </Button>
        </div>
      </div>
    </LoadScript>
  );
};

export default DriverMap;
