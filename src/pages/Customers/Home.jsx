import React from "react";
import Navbar from "../../components/common/Navbar/Navbar";
import HeroSection from "../../components/home/HeroSection/HeroSection";
import MapContainer from "../../components/common/Map/Map";
import RestaurantList from "../../components/home/RestaurantList/RestaurantList";
import RestaurantApp from "../../components/home/Restaurants";
import { LocationProvider } from "../../components/contexts/LocationProvider";
import { CartProvider } from "../../components/contexts/CartProvider";

const CustomersHome = () => {
  return (
    <LocationProvider>
      <CartProvider>
      <Navbar />
      <RestaurantApp />
      </CartProvider>
    </LocationProvider>
  );
};

export default CustomersHome;
