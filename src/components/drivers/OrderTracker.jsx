import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../api/firebase";
import { Button } from "../ui/button";
import DriverMap from "./DriverMap";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import VideoCall from "../common/VideoCall";

const OrderTracker = ({ orderId }) => {
  const [orderStatus, setOrderStatus] = useState("Pending");
  const [pickupTime, setPickupTime] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [videoCallModal, setVideoCallModal] = useState(false);
  
  console.log(roomId); // For debugging

  useEffect(() => {
    const orderRef = doc(db, "orders", orderId);
    const fetchOrderData = async () => {
      try {
        const orderDoc = await getDoc(orderRef);
        const orderData = orderDoc.data();
        if (orderData) {
          if (orderData.status) setOrderStatus(orderData.status);
          if (orderData.pickupTime)
            setPickupTime(orderData.pickupTime.toDate());
          if (orderData.deliveryTime)
            setDeliveryTime(orderData.deliveryTime.toDate());
          if (orderData.orderData.customerLocation)
            setCustomerLocation(orderData.orderData.customerLocation);
          if (orderData.orderData.restaurant.location)
            setRestaurantLocation(orderData.orderData.restaurant.location);
          if (orderData.roomId) setRoomId(orderData.roomId);
          if(orderData.driverInfo.id) setDriverId(orderData.driverInfo.id);
          if(orderData.orderData.customerId) setCustomerId(orderData.orderData.customerId)
        }
      } catch (error) {
        console.error("Error fetching order data: ", error);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const updates = { status: newStatus };
      if (newStatus === "Picked Up") {
        updates.pickupTime = new Date();
        setPickupTime(updates.pickupTime);
      } else if (newStatus === "Delivered") {
        updates.deliveryTime = new Date();
        setDeliveryTime(updates.deliveryTime);
      }
      await updateDoc(orderRef, updates);
      setOrderStatus(newStatus);
    } catch (error) {
      console.error("Error updating order status: ", error);
    }
  };

  const openVideoCallModal = () => {
    console.log("Opening modal"); // For debugging
    setVideoCallModal(true);
  };

  return (
    <div>
      <p>Order Status: {orderStatus}</p>
      {pickupTime && <p>Pickup Time: {pickupTime.toLocaleString()}</p>}
      {deliveryTime && <p>Delivery Time: {deliveryTime.toLocaleString()}</p>}
      <DriverMap
        customerLocation={customerLocation}
        restaurantLocation={restaurantLocation}
      />
      <div className="flex mt-2 mb-2 items-center">
        <h4>Update Status: </h4>
        {orderStatus === "Accepted by driver" && (
          <Button onClick={() => handleUpdateStatus("Picked Up")}>
            Picked Up
          </Button>
        )}
        {orderStatus === "Picked Up" && (
          <Button onClick={() => handleUpdateStatus("Delivered")}>
            Delivered
          </Button>
        )}
      </div>
      <div>
        <Button onClick={openVideoCallModal}>Video Call</Button>
      </div>
      {
        roomId && driverId ? <VideoCall roomId={roomId} userId={driverId} role="driver" customerId={customerId} /> : ""
      }
      {/* <Dialog isOpen={videoCallModal} onDismiss={() => setVideoCallModal(false)}>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Video Call</DialogTitle>
          <VideoCall roomId={roomId} />
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default OrderTracker;
