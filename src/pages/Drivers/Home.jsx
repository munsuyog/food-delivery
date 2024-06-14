import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../api/firebase";
import { useAuth } from "../../components/contexts/AuthContext";
import { AuthProvider } from "../../components/contexts/AuthContext";
import { LocationProvider } from "../../components/contexts/LocationProvider";
import { CartProvider } from "../../components/contexts/CartProvider";
import Navbar from "../../components/common/Navbar/Navbar";
import AvailableOrders from "../../components/drivers/AvailableOrders";
import OrderTracker from "../../components/drivers/OrderTracker";

const DriversHome = () => {
  const { currentUser } = useAuth();
  const [assignedOrders, setAssignedOrders] = useState([]);

  const fetchAssignedOrders = async () => {
    try {
      const ordersCollection = collection(db, "orders");
      const ordersQuery = query(
        ordersCollection,
        where("driverInfo.id", "==", currentUser.uid)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      if (!ordersSnapshot.empty) {
        const ordersData = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAssignedOrders(ordersData);
      } else {
        setAssignedOrders([]);
      }
    } catch (error) {
      console.error("Error fetching assigned orders: ", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAssignedOrders();
    }
  }, [currentUser]);

  const pendingOrder = assignedOrders.find(
    (order) =>
      order.status == "Picked Up" ||
      order.status == "Accepted by driver"
  );

  return (
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <Navbar />
          <div className="p-4">
            {pendingOrder ? (
              <OrderTracker orderId={pendingOrder.id} />
            ) : (
              <AvailableOrders fetchAssignedOrders={fetchAssignedOrders} />
            )}
          </div>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  );
};

export default DriversHome;
