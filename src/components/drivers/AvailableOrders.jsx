import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from '../contexts/LocationProvider';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { Dialog, DialogOverlay, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog'; // Import shadcn components
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../ui/button';

const AvailableOrders = () => {
  const { city } = useLocation(); // Assuming useLocation provides city information
  const [availableOrders, setAvailableOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order
  const {currentUser} = useAuth();
  console.log(currentUser)

  useEffect(() => {
    const fetchAvailableOrders = async () => {
      try {
        const ordersCollection = collection(db, 'orders');
        const ordersQuery = query(ordersCollection, where('orderData.city', '==', city));
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAvailableOrders(ordersData);
      } catch (error) {
        console.error('Error fetching available orders: ', error);
      }
    };

    fetchAvailableOrders();
  }, [city]);

  const handleAcceptOrder = async (orderId) => {
    try {
      // Update the order document with driver's information and initial status
      const orderRef = doc(db, 'orders', orderId);
      const driverInfo = {
        name: currentUser.displayName,
        id: currentUser.uid,
        location: null,
      };
      const orderData = {
        driverInfo,
        status: "Accepted by driver", // Set initial status here
      };
      await updateDoc(orderRef, orderData);
      // Remove the accepted order from the available orders list
      setAvailableOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error accepting order: ', error);
    }
  };
  

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Orders in {city}</h2>
      {availableOrders.length > 0 ? (
        <ul className="space-y-4">
          {availableOrders.map(order => (
            <li key={order.id}>
              <div className="border border-gray-300 p-4 rounded-lg">
                <p className="text-lg font-bold">Order ID: {order.id}</p>
                <p>Name: {order.orderData.name}</p>
                <p>Address: {order.orderData.address1}</p>
                <Button
                  onClick={() => handleAcceptOrder(order.id)} // Set selected order when button clicked
                >
                  Accept Order
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No available orders in {city}</p>
      )}

      {/* Dialog for displaying order details */}
      {selectedOrder && (
        <Dialog isOpen={selectedOrder !== null} onDismiss={() => setSelectedOrder(null)}>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              <p>Name: {selectedOrder.orderData.name}</p>
              <p>Address: {selectedOrder.orderData.address1}</p>
              <p>Amount: {selectedOrder.orderData.amount}</p>
            </DialogDescription>
            <button
              onClick={() => setSelectedOrder(null)}
              className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 mt-4 hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
            >
              Close
            </button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AvailableOrders;
