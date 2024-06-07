import React from 'react'
import Navbar from '../../components/common/Navbar/Navbar'
import RestaurantsTab from '../../components/restaurants/RestaurantsTabs/RestaurantsTab'
import { LocationProvider } from '../../components/contexts/LocationProvider'
import { CartProvider } from '../../components/contexts/CartProvider'

const RestaurantsHome = () => {
  return (
    <LocationProvider>
      <CartProvider>
        <Navbar />
        <RestaurantsTab />
      </CartProvider>
    </LocationProvider>
  )
}

export default RestaurantsHome