import React, { useState } from "react";
import RestaurantList from "./RestaurantList/RestaurantList";
import RestaurantMenu from "./RestaurantMenu";

const RestaurantApp = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleGoBack = () => {
    setSelectedRestaurant(null);
  };

  return (
    <div>
      {!selectedRestaurant ? (
        <RestaurantList onSelectRestaurant={handleSelectRestaurant} />
      ) : (
        <RestaurantMenu restaurant={selectedRestaurant} onGoBack={handleGoBack} />
      )}
    </div>
  );
};

export default RestaurantApp;
