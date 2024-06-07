import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { Button } from '../ui/button';

const DriverMap = () => {
  const mapStyles = {
    height: '400px',
    width: '100%'
  };

  const [currentPosition, setCurrentPosition] = useState(null);
  const [restaurantPosition, setRestaurantPosition] = useState({ lat: 40.712776, lng: -74.005974 }); // Example: New York
  const [customerPosition, setCustomerPosition] = useState({ lat: 40.730610, lng: -73.935242 }); // Example: New York

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

  const driverIcon = 'path/to/driver-icon.png';
  const restaurantIcon = 'path/to/restaurant-icon.png';
  const customerIcon = 'path/to/customer-icon.png';

  const getNavigationUrl = (destination) => {
    if (!currentPosition) return '#';
    const { lat, lng } = currentPosition;
    return `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}>
      <div>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={10}
          center={currentPosition || { lat: 0, lng: 0 }}
        >
          {currentPosition && (
            <MarkerF
              position={currentPosition}
              icon={driverIcon}
              label="Driver"
            />
          )}
          <MarkerF
            position={restaurantPosition}
            icon={restaurantIcon}
            label="Restaurant"
          />
          <MarkerF
            position={customerPosition}
            icon={customerIcon}
            label="Customer"
          />
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
