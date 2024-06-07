import React, { useState } from "react";
import Button from "../../common/Button/Button";
import "./LoginContainer.css";
import { loginAsRestaurant } from "../../../api/customer";
import { useAuth } from "../../contexts/AuthContext";

const LoginContainer = () => {
    const { setCurrentUser, setUserType, loginAsCustomer, loginAsDriver } = useAuth();
    const [error, setError] = useState(null);

    const handleLoginCustomer = async () => {
        try {
            await loginAsCustomer();
            setUserType("customer")
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLoginRestaurant = async () => {
        try {
            await loginAsRestaurant(setCurrentUser, setUserType);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLoginDriver = async () => {
        try {
            await loginAsDriver();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login_container">
            <h4 className="login_container_heading">
                Welcome to <br />
                <span>FoodDelivery</span>
            </h4>
            <Button title="Login as Customer" onClick={handleLoginCustomer} />
            <Button title="Login as Restaurant" onClick={handleLoginRestaurant} />
            <Button title="Login as Driver" onClick={handleLoginDriver} />
            {error && <p className="error_message">{error}</p>}
        </div>
    );
};

export default LoginContainer;
