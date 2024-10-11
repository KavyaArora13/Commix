import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Checkout.scss';
import { API_URL } from '../../config/api';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 5.00,
    total: 0,
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCartItems();
    fetchUserDetails();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchCartItems = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${API_URL}/cart/${user.id}`);
      setCartItems(response.data.cartItems);
      calculateOrderSummary(response.data.cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to fetch cart items. Please try again.');
    }
  };

  const fetchUserDetails = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${API_URL}/users/${user.id}`);
      const userData = response.data.user;
      setFormData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        address: userData.address && userData.address[0] ? userData.address[0] : '',
        phoneNumber: userData.phone_number || '',
        city: '',
        zipCode: '',
        country: '',
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to fetch user details. Please enter your information manually.');
    }
  };

  const calculateOrderSummary = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    setOrderSummary({
      subtotal,
      shipping: 5.00,
      total: subtotal + 5.00,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(`${API_URL}/orders/create`, {
        user_id: user.id,
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address: formData.address,
          city: formData.city,
          zip_code: formData.zipCode,
          country: formData.country,
          phone_number: formData.phoneNumber,
        },
      });
      console.log('Order created:', response.data);
      
      if (response.data.success) {
        initiateRazorpayPayment(response.data);
      } else {
        setError('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const initiateRazorpayPayment = (orderData) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: orderData.order_details.total_amount * 100,
      currency: 'INR',
      name: 'Comix',
      description: 'Purchase Description',
      order_id: orderData.payment_order_id,
      handler: function (response) {
        handlePaymentSuccess(response, orderData.order_id);
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phoneNumber,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  const handlePaymentSuccess = async (paymentResponse, orderId) => {
    try {
      const response = await axios.post(`${API_URL}/payments/verify`, {
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        order_id: orderId,
      });

      if (response.data.success) {
        console.log('Payment successful');
        // Redirect to success page or show success message
      } else {
        setError('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setError('Payment verification failed. Please contact support.');
    }
  };

  return (
    <Container className="checkout-container my-5">
      <h1 className="mb-4">Checkout</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <h2 className="mb-3">Shipping Information</h2>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Place Order'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h2 className="mb-3">Order Summary</h2>
              {cartItems.map((item, index) => (
                <div key={index} className="d-flex justify-content-between mb-2">
                  <span>{item.product_id.name} x {item.quantity}</span>
                  <span>${item.total_price.toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>${orderSummary.shipping.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>${orderSummary.total.toFixed(2)}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;