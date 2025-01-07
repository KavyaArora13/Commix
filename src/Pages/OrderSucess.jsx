import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Assets/Css/OrderCompleted.scss';
import logoImage from '../Assets/Image/logo/Mask group.png';

const OrderCompleted = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {
        // Check if user is logged in by looking for access token
        const accessToken = localStorage.getItem('accessToken');
        setIsLoggedIn(!!accessToken);
    }, []);
  
    const handleViewOrder = () => {
        navigate('/profile', { state: { activeSection: 'order-history' } });
    };

    return (
        <div className="order-completed-page">
            <div className="content-container">
                <img src={logoImage} alt="COMIX" className="logo" />
                <div className="order-status">
                    <h2>Order Completed</h2>
                    <p className="arrival">Arriving By Mon, May 2024</p>
                    {isLoggedIn && (
                        <button className="view-order-btn" onClick={handleViewOrder}>
                            View order
                        </button>
                    )}
                </div>
                <div className="checkmark">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <h3>Your order is Completed</h3>
                <p className="thank-you">
                    Thank You for your order! {isLoggedIn 
                        ? "We're processing your order and will update you via email." 
                        : "We've sent your order confirmation to your email."}
                </p>
                <Link to="/" className="continue-shopping-btn">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderCompleted;