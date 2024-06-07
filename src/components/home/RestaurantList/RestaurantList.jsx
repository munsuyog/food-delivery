import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../api/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { useLocation } from "../../contexts/LocationProvider";

const RestaurantList = ({ onSelectRestaurant }) => {
  const [restaurants, setRestaurants] = useState([]);
  const { city, error, updateLocation } = useLocation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "restaurants"));
        const restaurantData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRestaurants(restaurantData);
      } catch (error) {
        console.error("Error fetching restaurants: ", error.message);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on city
  const filteredRestaurants = city
    ? restaurants.filter((restaurant) => restaurant.city === city)
    : [];

  return (
    <div className="p-5">
      <h2>Available Restaurants in {city || "your area"}</h2>
      {error && <p>Error fetching location: {error}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
        {filteredRestaurants.map((restaurant) => (
          <Card
            key={restaurant.id}
            onClick={() => onSelectRestaurant(restaurant)}
            className="cursor-pointer overflow-hidden"
          >
            <img
              src={restaurant.restaurantPic}
              alt={`${restaurant.restaurantName} image`}
              className="w-full h-[300px] object-cover"
            />
            <CardHeader>
              <CardTitle>{restaurant.restaurantName}</CardTitle>
            </CardHeader>
            <CardContent>{restaurant.address}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
