import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Assets/Css/CheckOut/CheckOut.scss';
import PersonalInfoForm from '../Components/Checkout/PersonalInfoForm.jsx';
import ProductItem from '../Components/Checkout/ProductItem.jsx';
import VoucherSection from '../Components/Checkout/VoucherSection.jsx';
import TotalSummary from '../Components/Checkout/TotalSummary.jsx';
import { API_URL } from "../config/api.js";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const CheckOut = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 103.50,
    total: 0,
    vat: 0
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          throw new Error('User not found in localStorage');
        }
        const userData = JSON.parse(userString);
        if (!userData.user || !userData.user.id) {
          throw new Error('Invalid user data in localStorage');
        }
        const userId = userData.user.id;

        const [cartResponse, userResponse] = await Promise.all([
          axiosInstance.get(`/cart/${userId}`),
          axiosInstance.get(`/users/${userId}`)
        ]);

        if (!cartResponse.data.cartItems || cartResponse.data.cartItems.length === 0) {
          navigate('/cart');
          return;
        }

        setCartItems(cartResponse.data.cartItems);
        setUserInfo(userResponse.data.user);

        if (userResponse.data.user.address && userResponse.data.user.address.length > 0) {
          setSelectedAddress(userResponse.data.user.address[0]);
        } else {
          setShowAddressForm(true);
        }

        // Calculate order summary
        const subtotal = cartResponse.data.cartItems.reduce((sum, item) => sum + item.total_price, 0);
        const total = subtotal + orderSummary.shipping;
        const vat = total * 0.05; // Assuming 5% VAT

        setOrderSummary({
          subtotal,
          shipping: orderSummary.shipping,
          total,
          vat
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load checkout data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
    loadRazorpayScript();
  }, [navigate]);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  };

  const handlePersonalInfoSubmit = async (formData) => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        throw new Error('User not found in localStorage');
      }
      const userData = JSON.parse(userString);
      const userId = userData.user.id;

      await axiosInstance.put(`/users/${userId}`, formData);
      setUserInfo({ ...userInfo, ...formData });
      setSelectedAddress(formData);
      setShowAddressForm(false);
    } catch (error) {
      console.error('Error updating user info:', error);
      setError('Failed to update personal information. Please try again.');
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleAddNewAddress = () => {
    setShowAddressForm(true);
  };

  const initiateRazorpayPayment = async () => {
    try {
      if (!razorpayLoaded) {
        throw new Error('Razorpay SDK is not loaded yet');
      }

      const userString = localStorage.getItem('user');
      if (!userString) {
        throw new Error('User not found in localStorage');
      }
      const userData = JSON.parse(userString);
      const userId = userData.user.id;

      const orderResponse = await axiosInstance.post('/payment/create', {
        user_id: userId,
        amount: orderSummary.total,
        currency: 'INR'
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || 'Failed to create order');
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'Comix',
        description: 'Purchase Description',
        order_id: orderResponse.data.order_id,
        handler: async function (response) {
          try {
            const verificationResponse = await axiosInstance.post('/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            
            if (verificationResponse.data.success) {
              navigate('/order-success');
            } else {
              throw new Error(verificationResponse.data.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            setError(error.response?.data?.message || error.message || 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: userInfo.phone
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      setError('An error occurred while initiating the payment. Please try again.');
    }
  };

  const renderAddressCard = (address, index) => (
    <div key={index} className="address-card mb-3 p-3 border rounded">
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="address"
          id={`address${index}`}
          checked={selectedAddress === address}
          onChange={() => handleAddressSelect(address)}
        />
        <label className="form-check-label ms-2" htmlFor={`address${index}`}>
          <strong className="d-block mb-2">{address.firstName} {address.lastName}</strong>
          <span className="d-block">{address.street}, {address.house}</span>
          <span className="d-block">{address.postcode}, {address.location}</span>
          <span className="d-block">{address.country}</span>
        </label>
      </div>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Header/>
      <div className="container-fluid checkout-container py-5">
        <div className="row">
          <div className="col-12">
            <div className="checkout-header mb-4">
              <h1 className="checkout-title">Check Out</h1>
              <Link to="/product" className="continue-shopping-link">
                 continue shopping
              </Link>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                {userInfo && userInfo.address && userInfo.address.length > 0 && !showAddressForm ? (
                  <div>
                    <h3 className="mb-4">Select Delivery Address</h3>
                    {userInfo.address.map((address, index) => renderAddressCard(address, index))}
                    <button onClick={handleAddNewAddress} className="btn btn-dark w-100 py-2">Add New Address</button>
                  </div>
                ) : (
                  <div>
                    <h3 className="mb-4">Add New Address</h3>
                    <PersonalInfoForm initialData={userInfo} onSubmit={handlePersonalInfoSubmit} />
                  </div>
                )}
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                  <div className='payment-options p-4 bg-light rounded shadow-sm'>
                    <h3 className="mb-4">Payment Method</h3>
                    <div className='payment-method d-flex align-items-center'>
                      <div className="payment-logo-container me-3">
                        <img src="/images/razor-pay.png" alt="Razor Pay" className="payment-logo" style={{maxWidth: '100px'}} />
                      </div>
                      <span className="payment-name me-3">Razor Pay</span>
                      <input type="checkbox" className="payment-checkbox form-check-input" />
                    </div>
                  </div>
              </div>
              <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                <div className="checkout-summary-wrapper">
                  <div className="checkout-summary p-4 bg-light rounded shadow-sm">
                    <div className="checkout-summary-header mb-4">
                      <h3 className="checkout-summary-title">Order Summary</h3>
                    </div>
                    <div className="checkout-product-list">
                      {cartItems.map((item) => (
                        <ProductItem
                          key={item.product_id._id}
                          image={item.product_id.image_urls[0]}
                          quantity={item.quantity}
                          description={item.product_id.description}
                          name={item.product_id.name}
                          subDescription={item.product_id.subDescription}
                          price={item.price}
                        />
                      ))}
                    </div>
                  </div>
                  <VoucherSection/>
                  <TotalSummary 
                    subtotal={orderSummary.subtotal}
                    shipping={orderSummary.shipping}
                    total={orderSummary.total}
                    vat={orderSummary.vat}
                    onCheckout={initiateRazorpayPayment}
                    isPaymentDisabled={!razorpayLoaded}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default CheckOut;