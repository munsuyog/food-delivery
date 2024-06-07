import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { Button } from '../ui/button';
import DriverMap from './DriverMap';

const OrderTracker = ({ orderId }) => {
  const [orderStatus, setOrderStatus] = useState('Pending'); // Default status is 'Pending'
  const [pickupTime, setPickupTime] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(null);

  useEffect(() => {
    const orderRef = doc(db, 'orders', orderId);
    const fetchOrderData = async () => {
      try {
        const orderDoc = await getDoc(orderRef);
        const orderData = orderDoc.data();
        if (orderData) {
          if (orderData.status) setOrderStatus(orderData.status);
          if (orderData.pickupTime) setPickupTime(orderData.pickupTime.toDate());
          if (orderData.deliveryTime) setDeliveryTime(orderData.deliveryTime.toDate());
        }
      } catch (error) {
        console.error('Error fetching order data: ', error);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const updates = { status: newStatus };
      if (newStatus === 'Picked Up') {
        updates.pickupTime = new Date();
        setPickupTime(updates.pickupTime);
      } else if (newStatus === 'Delivered') {
        updates.deliveryTime = new Date();
        setDeliveryTime(updates.deliveryTime);
      }
      await updateDoc(orderRef, updates);
      setOrderStatus(newStatus);
    } catch (error) {
      console.error('Error updating order status: ', error);
    }
  };

  return (
    <div>
      <p>Order Status: {orderStatus}</p>
      {pickupTime && <p>Pickup Time: {pickupTime.toLocaleString()}</p>}
      {deliveryTime && <p>Delivery Time: {deliveryTime.toLocaleString()}</p>}
      <DriverMap />
      <div className='flex mt-2 mb-2 items-center'>      
        <h4>Update Status: </h4>
      {/* Buttons to change the order status */}
      {orderStatus === 'Accepted by driver' && (
        <Button onClick={() => handleUpdateStatus('Picked Up')}>Picked Up</Button>
      )}
      {orderStatus === 'Picked Up' && (
        <Button onClick={() => handleUpdateStatus('Delivered')}>Delivered</Button>
      )}</div>
    </div>
  );
};

export default OrderTracker;
