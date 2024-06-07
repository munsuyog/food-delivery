import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { encode } from "base-64";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../api/firebase";
import { useAuth } from "../contexts/AuthContext";

const PlaceOrderForm = () => {
  const location = useLocation();
  const { cart, restaurant } = location.state;
  const {currentUser} = useAuth();
  const [name, setName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState(
    cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  );
  console.log(currentUser)

  const paypalConfig = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT,
    clientSecret: import.meta.env.VITE_PAYPAL_SECRET,
    environment: "sandbox" // use "live" for production
  };

  const proceedToPayment = async () => {
    try {
      const credentials = `${paypalConfig.clientId}:${paypalConfig.clientSecret}`;
      const encodedCredentials = encode(credentials);

      // Get PayPal access token
      const tokenResponse = await axios.post(
        "https://api-m.sandbox.paypal.com/v1/oauth2/token",
        "grant_type=client_credentials",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${encodedCredentials}`,
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Create PayPal order
      const orderResponse = await axios.post(
        "https://api-m.sandbox.paypal.com/v2/checkout/orders",
        {
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: amount,
              },
            },
          ],
          application_context: {
            return_url: "http://localhost:5173/success", // Replace with your actual return URL
            cancel_url: "http://localhost:5173/failure", // Replace with your actual cancel URL
          },
          orderInfo: {
            // Add order information here
            name,
            address1,
            address2,
            city,
            mobileNumber,
            amount,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const approvalLink = orderResponse.data.links.find((link) => link.rel === "approve");

      if (approvalLink) {
        // Save order details to Firestore with the PayPal order ID as the document name
        const paypalOrderId = orderResponse.data.id;
        console.log(orderResponse.data)
        const orderData = {
          name,
          address1,
          address2,
          city,
          mobileNumber,
          amount,
          paypalOrderId,
          cart,
          restaurant: restaurant, 
          customerId: currentUser.uid,
          customerEmail: currentUser.providerData[0].email,
          status: "Pending"
        };

        const ordersCollectionRef = doc(db, "orders", paypalOrderId);
        await setDoc(ordersCollectionRef, {orderData: orderData});
  
        window.location.href = approvalLink.href;
      } else {
        console.error("PayPal checkout URL not found");
      }
    } catch (error) {
      console.error("PayPal Error: ", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    proceedToPayment();
  };

  return (
    <div>
      <h1>Order Details</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <Label htmlFor="address1">Address Line 1</Label>
          <Input
            id="address1"
            name="address1"
            type="text"
            required
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <Label htmlFor="address2">Address Line 2</Label>
          <Input
            id="address2"
            name="address2"
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <Input
            id="mobileNumber"
            name="mobileNumber"
            type="text"
            required
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="text"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full"
            readOnly
          />
        </div>
        <Button type="submit">Pay Now</Button>
      </form>
    </div>
  );
};

export default PlaceOrderForm;
