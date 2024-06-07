import React from "react";
import OrdersCustomer from "../../components/order/Orders";
import Navbar from "../../components/common/Navbar/Navbar";
import { AuthProvider } from "../../components/contexts/AuthContext";
import { CartProvider } from "../../components/contexts/CartProvider";
import { LocationProvider } from "../../components/contexts/LocationProvider";

const OrdersPage = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <LocationProvider>
          <Navbar />
          <OrdersCustomer />
        </LocationProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default OrdersPage;
