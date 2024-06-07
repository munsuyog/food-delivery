import React from "react";
import { AuthProvider, useAuth } from "../components/contexts/AuthContext";
import Navbar from "../components/common/Navbar/Navbar";
import LoginContainer from "../components/home/LoginContainer/LoginContainer";
import HeroSection from "../components/home/HeroSection/HeroSection";
import MapContainer from "../components/common/Map/Map";
import CustomersHome from "./Customers/Home";
import RestaurantsHome from "./Restaurants/Home";
import DriversHome from "./Drivers/Home";
import { Toaster } from "../components/ui/toaster";

const Home = () => {
  const { currentUser, userType } = useAuth();

  if(userType == "customer") {
    return <>
      <CustomersHome />
      <Toaster />
    </>
  } else if (userType == "restaurant") {
    return <>
      <RestaurantsHome />
      <Toaster />
    </>
  } else if(userType == "driver") {
    return <>
      <DriversHome />
      <Toaster />
    </>
  } else {
    return <LoginContainer />
  }
};

export default Home;
