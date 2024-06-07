import React, { createContext, useContext, useEffect, useState } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch address information.');
      }
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        const cityComponent = addressComponents.find(component =>
          component.types.includes('locality') ||
          component.types.includes('administrative_area_level_2')
        );
        setCity(cityComponent ? cityComponent.long_name : 'Unknown location');
        setAddress(data.results[0].formatted_address);
      } else {
        setError('No address information found.');
      }
    } catch (error) {
      setError('Error fetching address information.');
      console.error(error);
    }
  };

  const updateLocation = () => {
    if ('geolocation' in navigator) {
      const handleSuccess = (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setError(null);
        fetchAddress(latitude, longitude);
      };

      const handleError = (error) => {
        setError(error.message);
      };

      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 8000,
      });
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const updateCityManually = (newCity) => {
    setCity(newCity);
    setAddress(null);  // Reset address as it may not correspond to the new city
    setLocation(null);  // Reset location as it is manually updated
  };

  useEffect(() => {
    updateLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, city, address, error, updateLocation, updateCityManually }}>
      {children}
    </LocationContext.Provider>
  );
};
