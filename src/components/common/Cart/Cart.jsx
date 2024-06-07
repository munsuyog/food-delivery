import React, { useState } from "react";
import { useCart } from "../../contexts/CartProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";

const Cart = ({ onClearCart }) => {
  const { cart, clearCart, restaurant } = useCart();
  const [cartMenu, setCartMenu] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    navigate('/place-order', { state: { cart, restaurant } });
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setCartMenu(true)}
      onMouseLeave={() => setCartMenu(false)}
    >
      <FontAwesomeIcon icon={faShoppingCart} className="text-gray-600" />
      <span className="ml-1 text-sm text-gray-600">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
      {cartMenu && (
        <div className="absolute -top-2 right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-10">
          <h4 className="font-semibold mb-2">Cart</h4>
          <ul className="space-y-2">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>${item.price} x {item.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 mt-2">
            <Button className="w-full" onClick={handlePlaceOrder}>Place Order</Button>
            <Button onClick={clearCart} className="w-full">Clear Cart</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
