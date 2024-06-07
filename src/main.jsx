import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import Book from "./pages/Customers/Book.jsx";
import { AuthProvider } from "./components/contexts/AuthContext.jsx";
import SuccessPage from "./pages/SuccessPage";
import PlaceOrder from "./pages/PlaceOrder";
import OrdersPage from "./pages/Customers/Orders";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/restaurant/menu" />
        <Route path="/orders" Component={OrdersPage} />
        <Route path="/order/details" Component={OrderDetails} />
        <Route path="/order/book/:foodId" Component={Book} />
        <Route path="/place-order" Component={PlaceOrder} />
        <Route path="/success" Component={SuccessPage} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
