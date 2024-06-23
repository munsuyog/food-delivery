import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../../api/firebase";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogTitle, DialogContent } from "../ui/dialog";
import VideoCall from "../common/VideoCall";

const OrdersCustomer = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  console.log(selectedOrder);
  console.log(orders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("orderData.customerId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (!querySnapshot.empty) {
          setOrders(ordersData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const selectOrder = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const getOrderAmount = (order) => {
    if (
      order &&
      order.paymentData &&
      order.paymentData.purchase_units &&
      order.paymentData.purchase_units[0].payments &&
      order.paymentData.purchase_units[0].payments.captures &&
      order.paymentData.purchase_units[0].payments.captures[0].amount.value
    ) {
      return order.paymentData.purchase_units[0].payments.captures[0].amount
        .value;
    } else if (
      order &&
      order.paymentData &&
      order.paymentData.purchase_units &&
      order.paymentData.purchase_units[0].amount &&
      order.paymentData.purchase_units[0].amount.value
    ) {
      return order.paymentData.purchase_units[0].amount.value;
    }
    return null;
  };

  return (
    <div className="p-4">
      <h3>Orders</h3>
      <div className="flex flex-col gap-2 mt-2">
        {orders &&
          orders.map((order) => {
            if (order) {
              return (
                <Card
                  key={order.id}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    {order.orderData &&
                      order.orderData.cart.map((item) => (
                        <React.Fragment key={item.name}>
                          <h4>{item.name}</h4>
                          <p>Quantity: {item.quantity}</p>
                        </React.Fragment>
                      ))}
                    <p>Status: {order.status}</p>
                  </div>
                  <Button
                    onClick={() => {
                      selectOrder(order);
                    }}
                  >
                    View Details
                  </Button>
                </Card>
              );
            }
          })}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>
            OrderID:{" "}
            {selectedOrder ? selectedOrder.orderData.paypalOrderId : ""}
          </DialogTitle>
          <div>
            <h4>Items</h4>
            {selectedOrder &&
              selectedOrder.orderData.cart.map((item) => (
                <div key={item.name}>
                  <h5>
                    {item.name} x {item.quantity}
                  </h5>
                </div>
              ))}
          </div>
          <div>
            <h4>Customer Details</h4>
            <p>Name: {selectedOrder && selectedOrder.orderData.name}</p>
            <p>
              Address: {selectedOrder && selectedOrder.orderData.address1},{" "}
              {selectedOrder && selectedOrder.orderData.address2}
            </p>
          </div>
          <div>
            <h4>Payment Details</h4>
            <p>Amount: ${getOrderAmount(selectedOrder)}</p>
            <p>
              Status:{" "}
              {selectedOrder && selectedOrder.paymentData
                ? selectedOrder.paymentData.status
                : ""}
            </p>
          </div>
          <div>
            <h4>Order Status</h4>
            <p>Status: {selectedOrder ? selectedOrder.status : ""}</p>
            <p>
              Restaurant Status:{" "}
              {selectedOrder && selectedOrder.restaurantStatus
                ? selectedOrder.restaurantStatus
                : "Not yet Updated"}
            </p>
          </div>
          {selectedOrder &&
          selectedOrder.roomId ? (
            <VideoCall roomId={selectedOrder.roomId} />
          ) : (
            ""
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersCustomer;
