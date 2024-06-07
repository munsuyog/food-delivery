import React, { useState } from "react";
import "./Navbar.css";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "../../contexts/LocationProvider";
import Cart from "../Cart/Cart";

const Navbar = () => {
  const [profileMenu, setProfileMenu] = useState(false);
  const [locationMenu, setLocationMenu] = useState(false);
  const { currentUser, logOut, userType } = useAuth();
  const { city, updateLocation, updateCityManually } = useLocation();
  const [manualCity, setManualCity] = useState("");

  const handleManualCityUpdate = () => {
    updateCityManually(manualCity);
    setManualCity("");
  };

  return (
    <section id="navbar" className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <h3 className="text-2xl font-bold text-gray-800">FoodDelivery</h3>
      <div className="flex items-center space-x-6">
        <div 
          className="relative" 
          onMouseEnter={() => setLocationMenu(true)} 
          onMouseLeave={() => setLocationMenu(false)}
        >
          <button className="flex items-center space-x-2 text-gray-600">
            <FontAwesomeIcon icon={faRefresh} className="text-gray-600" />
            <p>{city || "Fetching location..."}</p>
            <FontAwesomeIcon icon={faLocationDot} className="text-gray-600" />
          </button>
          {locationMenu && (
            <div className="absolute -top-1 left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-4 z-10">
              <button 
                onClick={updateLocation} 
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                Update Location Auto
              </button>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter city"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleManualCityUpdate} 
                  className="w-full mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
        
        {userType == "customer" && <>
          <Cart />
          <a href="/orders">Orders</a>
        </>}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setProfileMenu(true)}
          onMouseLeave={() => setProfileMenu(false)}
        >
          <img
            className="w-8 h-8 rounded-full border border-gray-300"
            src={currentUser.photoURL}
            alt="Profile"
          />
          <a className="ml-2 text-gray-600 hover:text-gray-800 transition-colors">{currentUser.displayName}</a>
          {profileMenu && (
            <div className="absolute right-0 mt-2 top-5 w-40 bg-white border rounded-lg shadow-lg p-4 z-10 flex flex-col justify-center">
              <Button title="Log Out" onClick={logOut} className="w-full mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Navbar;
