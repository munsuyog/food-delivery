import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurant, setRestaurant] = useState({ name: "", address: "", location: {} });

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const setRestaurantDetails = (name, address, location) => {
    setRestaurant({ name, address, location });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, restaurant, setRestaurantDetails }}>
      {children}
    </CartContext.Provider>
  );
};
