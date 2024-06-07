import React, { useState } from "react";
import { Dialog, DialogOverlay, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog'
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const OrderModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState(""); // Add amount state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form will submit to Payflow Link automatically due to action attribute
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle>Order Details</DialogTitle>
        <DialogDescription>Please fill in your details to complete the order.</DialogDescription>
        <form
          action="https://payflowlink.paypal.com"
          method="POST"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input type="hidden" name="LOGIN" value="SuyogM" />
          <input type="hidden" name="PARTNER" value="PayPal" />
          <input type="hidden" name="AMOUNT" value={amount} />
          <input type="hidden" name="TYPE" value="S" />

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
            />
          </div>
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="ACCT"
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Label htmlFor="expiryDate">Expiry Date (MMYY)</Label>
            <Input
              id="expiryDate"
              name="EXPDATE"
              type="text"
              required
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              name="CVV2"
              type="text"
              required
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="mt-1 block w-full"
            />
          </div>
          <Button type="submit">Pay Now</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
