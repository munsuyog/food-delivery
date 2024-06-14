import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../api/firebase";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Dialog, DialogTitle, DialogContent } from "../../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("Undefined");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  console.log(selectedOrder)

  useEffect(() => {
    const getOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error(error);
      }
    };

    getOrders();
  }, []);

  const selectOrder = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedOrder(null);
    setIsDialogOpen(false);
  };

  const updateStatus = async (order) => {
    try {
      const orderRef = doc(db, "orders", order.id);
      await updateDoc(orderRef, { restaurantStatus: orderStatus });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-5">
      <h4>Active Orders</h4>
      {orders &&
        orders.map((order) => {
          if (order.paymentData) {
            return (
              <Card
                key={order.id}
                className="p-4 flex justify-between items-center"
              >
                {order.orderData &&
                  order.orderData.cart.map((cart) => (
                    <div key={cart.name}>
                      <h4>{cart.name}</h4>
                      <p>Quantity: {cart.quantity}</p>
                    </div>
                  ))}
                <div>
                  <Button onClick={() => selectOrder(order)}>Manage</Button>
                </div>
              </Card>
            );
          }
        })}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>
            OrderID:{" "}
            {selectedOrder ? selectedOrder.orderData.paypalOrderId : ""}
          </DialogTitle>
          <div>
            <h4>Items</h4>
            {selectedOrder
              ? selectedOrder.orderData.cart.map((item) => (
                  <div key={item.name}>
                    <h5>
                      {item.name} x {item.quantity}
                    </h5>
                  </div>
                ))
              : ""}
          </div>
          <div>
            <h4>Customer Details</h4>
            <p>Name: {selectedOrder ? selectedOrder.orderData.name : ""}</p>
            <p>
              Address: {selectedOrder ? selectedOrder.orderData.address1 : ""},{" "}
              {selectedOrder ? selectedOrder.orderData.address2 : ""}
            </p>
          </div>
          <div>
            <h4>Payment Details</h4>
            <p>
              Amount: $
              {selectedOrder &&
              selectedOrder.paymentData &&
              selectedOrder.paymentData.purchase_units &&
              selectedOrder.paymentData.purchase_units[0]
                ? selectedOrder.paymentData.purchase_units[0]
                    .amount.value
                : ""}
            </p>
            <p>
              Status: {selectedOrder ? selectedOrder.paymentData.status : ""}
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline">Update Status</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={selectedOrder ? selectedOrder.restaurantStatus : ""}
                  onValueChange={(value) => {
                    setOrderStatus(value);
                    updateStatus(selectedOrder);
                  }}
                >
                  <DropdownMenuRadioItem value="Preparing">
                    Preparing
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Handed over to driver">
                    Handed over to driver
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* <Button onClick={closeDialog}>Close</Button> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RestaurantOrders;
