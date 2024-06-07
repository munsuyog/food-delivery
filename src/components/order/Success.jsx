import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { encode } from "base-64";
import { getDoc, setDoc } from "firebase/firestore";
import { db } from "../../api/firebase";
import { doc } from "firebase/firestore";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paypalConfig = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT,
    clientSecret: import.meta.env.VITE_PAYPAL_SECRET,
    environment: "sandbox" // use "live" for production
  };

  useEffect(() => {
    const handleSuccess = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const payerId = params.get("PayerID");

      if (!token || !payerId) {
        setError("Invalid payment details.");
        setLoading(false);
        return;
      }

      try {
        const credentials = `${paypalConfig.clientId}:${paypalConfig.clientSecret}`;
        const encodedCredentials = encode(credentials);

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

        const captureResponse = await axios.get(
          `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const paymentData = captureResponse.data;
        console.log(paymentData);

        const ordersRef = doc(db, 'orders', paymentData.id);

        // Retrieve existing document data
        const docSnapshot = await getDoc(ordersRef);
        const existingData = docSnapshot.data();

        // Merge existing data with new payment data
        const mergedData = {
          ...existingData,
          paymentData: paymentData,
        };

        // Update the document with the merged data
        await setDoc(ordersRef, mergedData);

        setLoading(false);
        navigate('/orders'); // Use navigate instead of redirect
      } catch (error) {
        console.error("Error capturing payment: ", error);
        if (error.response && error.response.data) {
          console.error("Error details: ", error.response.data);
        }
        setError("An error occurred while processing your payment.");
        setLoading(false);
      }
    };

    handleSuccess();
  }, [location, paypalConfig, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Payment successful! Thank you for your purchase.</div>;
};

export default SuccessPage;
