import React, { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../api/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useCart } from "../contexts/CartProvider";

const RestaurantMenu = ({ restaurant, onGoBack }) => {
  const [menuItems, setMenuItems] = useState([]);
  const { addToCart, setRestaurantDetails } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const restaurantRef = doc(db, "restaurants", restaurant.id);
        const restaurantDoc = await getDoc(restaurantRef);
        if (restaurantDoc.exists()) {
          setMenuItems(restaurantDoc.data().menu);
        }
      } catch (error) {
        console.error("Error fetching menu: ", error.message);
      }
    };

    fetchMenu();
  }, [restaurant.id]);

  return (
    <div className="p-5">
            <button onClick={onGoBack} className="bg-gray-200 px-4 py-2 rounded-lg mb-4 hover:bg-gray-300">
        Go Back
      </button>
      <h2>{restaurant.restaurantName} Menu</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
        {menuItems.map((item) => (
          <Card key={item.id} className="cursor-pointer flex items-center justify-between">
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <p>${parseFloat(item.price).toFixed(2)}</p>
            </CardHeader>
            <CardContent>
              <Button onClick={() => {addToCart({ ...item, price: parseFloat(item.price) }); setRestaurantDetails(restaurant.restaurantName, restaurant.address, restaurant.location)}}>
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu;
