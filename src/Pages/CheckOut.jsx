import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import '../Assets/Css/CheckOut/CheckOut.scss';
import PersonalInfoForm from '../Components/Checkout/PersonalInfoForm.jsx';
import ProductItem from '../Components/Checkout/ProductItem.jsx';
import OfferSection from '../Components/Checkout/OfferSection.jsx';
import TotalSummary from '../Components/Checkout/TotalSummary.jsx';
import { API_URL } from "../config/api.js";
import Touch from '../Components/Touch';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItemCount } from '../features/cart/cartSlice';
import { addAddress, fetchUserDetails } from '../features/user/userSlice';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
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

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request being sent:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      fullPath: config.baseURL + config.url
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const CheckOut = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userInfo, setUserInfo] = useState({ address: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 103.50,
    total: 0,
    vat: 0,
    discount: 0
  });
  const [selectedAddress, setSelectedAddress] = useState(() => {
    const guestAddresses = JSON.parse(localStorage.getItem('guestAddresses'));
    return guestAddresses && guestAddresses.length > 0 ? guestAddresses[0] : {}; // Set the first address if available
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: userDetails } = useSelector(state => state.user); // Get user details from Redux
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [addressesUpdated, setAddressesUpdated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [addressSelected, setAddressSelected] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      // Remove any existing Razorpay scripts first
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Clear any existing Razorpay instances
      window.Razorpay = undefined;

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = false; // Change to synchronous loading
      
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        setRazorpayLoaded(true);
        resolve();
      };

      script.onerror = (error) => {
        console.error('Failed to load Razorpay script:', error);
        reject(new Error('Failed to load Razorpay'));
      };

      document.head.appendChild(script); // Append to head instead of body
    });
  };

  const clearCart = async (userId) => {
    try {
      await axiosInstance.post('/cart/delete-cart', { user_id: userId });
      setCartItems([]);
      dispatch(updateCartItemCount(0));
      localStorage.removeItem('cartCount');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem('user');
    setIsGuestUser(!userString);
    
    // Check for guest addresses in local storage
    const guestAddresses = JSON.parse(localStorage.getItem('guestAddresses'));
    if (guestAddresses && guestAddresses.length > 0) {
      setSelectedAddress(guestAddresses[0]); // Set the first address if it exists
    }

    // Fetch other necessary data
    const fetchData = async () => {
      try {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');

        // Handle guest user
        if (!userString) {
          if (!guestCart.length) {
            navigate('/cart');
            return;
          }

          setCartItems(guestCart);
          setShowAddressForm(true);

          // Calculate order summary for guest cart
          const subtotal = guestCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const shipping = orderSummary.shipping;
          const total = subtotal + shipping;
          const vat = total * 0.05;

          setOrderSummary({
            subtotal,
            shipping,
            total,
            vat,
            discount: 0
          });

          setLoading(false);
          return;
        }

        // Handle logged-in user (existing code)
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
          vat,
          discount: 0
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load checkout data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, orderSummary.shipping, addressesUpdated]);

  const handleAddressSelection = (address) => {
    setSelectedAddress(address);
    setAddressSelected(true);
    if (isMobile) {
      setCurrentStep(2);
    }
  };

  const handlePersonalInfoSubmit = async (formData) => {
    try {
      if (isGuestUser) {
        const guestAddresses = JSON.parse(localStorage.getItem('guestAddresses') || '[]');
        guestAddresses.push(formData);
        localStorage.setItem('guestAddresses', JSON.stringify(guestAddresses));
        setSelectedAddress(formData);
      } else {
        const response = await axiosInstance.post('/api/address', formData);
        if (response.data.success) {
          dispatch(addAddress(formData));
          setSelectedAddress(formData);
        }
      }
      setAddressSelected(true);
      if (isMobile) {
        setCurrentStep(2);
      }
      setShowAddressForm(false);
    } catch (error) {
      console.error('Error submitting address:', error);
      toast.error('Failed to save address. Please try again.');
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleAddNewAddress = () => {
    setShowAddressForm(true);
  };

  const applyOffer = async (offerId) => {
    try {
      // Calculate the original subtotal first
      const originalSubtotal = cartItems.reduce((total, item) => 
        total + (Number(item.price) * Number(item.quantity)), 0
      );

      console.log('Original Subtotal:', originalSubtotal);

      // Remove current offer
      if (!offerId) {
        setAppliedOffer(null);
        const vat = originalSubtotal * 0.05;
        setOrderSummary({
          subtotal: originalSubtotal,
          shipping: 103.50,
          vat: vat,
          total: originalSubtotal + 103.50 + vat,
          discount: 0
        });
        
        // Call remove offer API
        try {
          await axiosInstance.post(`${API_URL}/offers/remove`);
          toast.success('Offer removed successfully');
        } catch (error) {
          console.error('Error removing offer:', error);
        }
        return;
      }

      // Apply new offer
      try {
        const response = await axiosInstance.post(`${API_URL}/offers/apply-offer`, {
          offerId: offerId,
          cartTotal: originalSubtotal
        });

        console.log('API Response:', response.data);

        if (response.data.success) {
          const { offer } = response.data;
          
          // Use the calculated values from the backend
          const discountAmount = offer.discountAmount;
          const vat = (originalSubtotal - discountAmount) * 0.05; // VAT after discount
          const total = (originalSubtotal - discountAmount) + 103.50 + vat;

          const newOrderSummary = {
            subtotal: originalSubtotal,
            shipping: 103.50,
            total: total,
            vat: vat,
            discount: discountAmount
          };

          console.log('New Order Summary:', newOrderSummary);

          setOrderSummary(newOrderSummary);
          setAppliedOffer({
            _id: offer.id,
            title: offer.title,
            discount_percentage: offer.discountPercentage
          });
          
          toast.success(`${offer.title} applied successfully! (${offer.discountPercentage}% off)`);
        }
      } catch (error) {
        console.error('API Error:', error);
        const errorMessage = error.response?.data?.message || 'Failed to apply offer';
        toast.error(errorMessage);
        throw error;
      }
    } catch (error) {
      console.error('Error in applyOffer:', error);
      toast.error('Failed to process offer');
      throw error;
    }
  };

  const updateOrderSummary = (discountAmount) => {
    setOrderSummary(prevSummary => {
      const newSubtotal = prevSummary.subtotal - discountAmount;
      const newTotal = newSubtotal + prevSummary.shipping;
      const newVat = newTotal * 0.05; // Assuming 5% VAT
      return {
        ...prevSummary,
        subtotal: newSubtotal,
        total: newTotal,
        vat: newVat,
        discount: discountAmount
      };
    });
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    if (isMobile && currentStep === 2) {
      setShowPaymentMethods(true);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setShowPaymentMethods(false);
    setCurrentStep(3);
  };

  const handleGuestCheckout = async () => {
    try {
      console.log('Starting guest checkout...');
      
      // Validate address data
      if (!selectedAddress) {
        toast.error('Please provide delivery address');
        return;
      }
  
      // Validate required fields
      const requiredFields = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone_number: 'Phone Number',
        street: 'Street Address',
        house: 'House/Building',
        postcode: 'Postal Code',
        location: 'City/Location',
        country: 'Country'
      };
  
      const missingFields = [];
      Object.entries(requiredFields).forEach(([field, label]) => {
        if (!selectedAddress[field]) {
          missingFields.push(label);
        }
      });
  
      if (missingFields.length > 0) {
        toast.error(`Please fill in the following fields: ${missingFields.join(', ')}`);
        return;
      }
  
      // Ensure Razorpay is loaded
      await loadRazorpayScript();
      
      if (!window.Razorpay) {
        throw new Error('Razorpay failed to initialize');
      }
  
      // Format cart items
      const formattedItems = cartItems.map(item => ({
        product_id: item.product_id,
        product_name: item._display?.name || item.product_id?.name || 'Unknown Product',
        quantity: Number(item.quantity),
        price: Number(item.price),
        total_price: Number(item.price * item.quantity)
      }));
  
      // Create order payload with validated data
      const orderPayload = {
        items: formattedItems,
        guest_info: {
          firstName: selectedAddress.firstName,
          lastName: selectedAddress.lastName,
          email: selectedAddress.email,
          phone: selectedAddress.phone_number
        },
        shipping_address: {
          street: selectedAddress.street,
          state: selectedAddress.state || 'NA', // Provide default value
          house: selectedAddress.house,
          postcode: selectedAddress.postcode,
          location: selectedAddress.location,
          country: selectedAddress.country,
          phone_number: selectedAddress.phone_number
        },
        total_amount: orderSummary.total
      };
  
      console.log('Creating order with payload:', orderPayload);
      const response = await axiosInstance.post('/payment/create-guest-order', orderPayload);
      console.log('Order creation response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create order');
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: response.data.amount * 100,
        currency: response.data.currency || 'INR',
        name: 'Your Store Name',
        description: 'Purchase Payment',
        order_id: response.data.payment_order_id,
        prefill: {
          name: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
          email: selectedAddress.email,
          contact: selectedAddress.phone_number
        },
        handler: async function(razorpayResponse) {
          try {
            console.log('Payment successful, verifying...', razorpayResponse);
            setIsProcessingPayment(true); // Start loading

            // Format the verification payload to match successful order structure
            const verificationPayload = {
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              is_guest: true,
              guest_info: {
                email: selectedAddress.email,
                phone: selectedAddress.phone_number
              },
              items: formattedItems.map(item => ({
                product_id: item.product_id,
                product_name: item.product_name || item._display?.name || 'Unknown Product',
                variant_name: '50ml',
                quantity: Number(item.quantity),
                price: Number(item.price),
                total_price: Number(item.price * item.quantity)
              })),
              total_amount: orderSummary.total,
              shipping_address: {
                street: selectedAddress.street,
                state: selectedAddress.state || 'NA',
                house: selectedAddress.house,
                postcode: selectedAddress.postcode,
                location: selectedAddress.location,
                country: selectedAddress.country,
                phone_number: selectedAddress.phone_number
              },
              payment_method: 'razorpay',
              payment_status: 'pending',
              order_status: 'pending',
              payment_details: {
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                payment_date: new Date()
              }
            };

            console.log('Sending verification payload:', verificationPayload);
            
            const verificationResponse = await axiosInstance.post(
              '/payment/verify-guest-payment', 
              verificationPayload
            );

            console.log('Verification response:', verificationResponse.data);

            if (verificationResponse.data.success) {
              localStorage.removeItem('guestCart');
              localStorage.removeItem('guestAddress');
              toast.success('Payment successful!');
              navigate('/order-success');
            } else {
              throw new Error(verificationResponse.data.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            console.error('Error details:', {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status
            });
            toast.error(error.message || 'Payment verification failed');
          } finally {
            setIsProcessingPayment(false); // End loading
          }
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            toast.error('Payment cancelled');
          }
        }
      };

      console.log('Creating Razorpay instance with options:', options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error in guest checkout:', error);
      toast.error(error.message || 'Failed to process checkout');
    }
  };

  const handleCODPayment = async () => {
    try {
      setIsProcessingPayment(true);
      
      // Format cart items
      const formattedItems = cartItems.map(item => ({
        product_id: item.product_id?._id || item.product_id,
        product_name: item._display?.name || item.product_id?.name || 'Unknown Product',
        variant_name: item.variant_name || '50ml',
        quantity: Number(item.quantity),
        price: Number(item.price),
        total_price: Number(item.price * item.quantity)
      }));

      // Create order payload
      const orderPayload = {
        items: formattedItems,
        total_amount: orderSummary.total,
        shipping_address: {
          street: selectedAddress.street,
          state: selectedAddress.state || 'NA',
          house: selectedAddress.house,
          postcode: selectedAddress.postcode,
          location: selectedAddress.location,
          country: selectedAddress.country,
          phone_number: selectedAddress.phone_number
        },
        payment_method: 'cod',
        payment_status: 'pending',
        order_status: 'pending'
      };

      // Add user-specific or guest-specific information
      if (isGuestUser) {
        orderPayload.is_guest = true;
        orderPayload.guest_info = {
          name: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
          email: selectedAddress.email,
          phone: selectedAddress.phone_number
        };
      } else {
        const userData = JSON.parse(localStorage.getItem('user'));
        orderPayload.user_id = userData.user?.id || userData.id;
      }

      // Send request to appropriate endpoint
      const endpoint = isGuestUser ? '/orders/create-guest-cod-order' : '/orders/create-cod-order';
      const response = await axiosInstance.post(endpoint, orderPayload);

      if (response.data.success) {
        // Clear cart based on user type
        if (!isGuestUser) {
          const userData = JSON.parse(localStorage.getItem('user'));
          await clearCart(userData.user?.id || userData.id);
        } else {
          localStorage.removeItem('guestCart');
          localStorage.removeItem('guestAddress');
        }

        toast.success('Order placed successfully!');
        navigate('/order-success');
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('COD order creation failed:', error);
      toast.error(error.message || 'Failed to create order');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const initiatePayment = async () => {
    console.log('Initiating payment...', { selectedPaymentMethod, isGuestUser });

    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      if (selectedPaymentMethod === 'cod') {
        await handleCODPayment();
      } else if (isGuestUser) {
        await handleGuestCheckout();
      } else {
        await initiateRazorpayPayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
    }
  };

  const initiateRazorpayPayment = async () => {
    try {
      // Validate address first
      if (!selectedAddress?.phone && !selectedAddress?.phone_number) {
        toast.error('Phone number is required');
        return;
      }
      if (!selectedAddress?.city && !selectedAddress?.location) {
        toast.error('Location is required');
        return;
      }

      const userString = localStorage.getItem('user');
      if (!userString) {
        throw new Error('User not found in localStorage');
      }
      const userData = JSON.parse(userString);
      const userId = userData.user?.id || userData.id;

      // Format items properly with price calculations
      const formattedItems = cartItems.map(item => {
        // Handle guest cart structure
        if (item._display) {
          return {
            product_id: item.product_id,
            product_name: item._display.name,
            variant_name: item.variant_name,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
            total_price: parseFloat(item.total_price)
          };
        }

        // Handle logged-in user cart structure
        const variant = item.product_id.variants?.find(v => v.name === item.variant_name) || 
                       item.product_id.variants?.[0] || 
                       { name: '50ml', price: item.product_id.price };
        
        const price = parseFloat(variant.price || item.product_id.price);
        const quantity = parseInt(item.quantity);
        
        return {
          product_id: item.product_id._id,
          product_name: item.product_id.name,
          variant_name: item.variant_name || '50ml',
          quantity: quantity,
          price: price,
          total_price: price * quantity
        };
      });

      // Create order on Razorpay
      const orderResponse = await axiosInstance.post('/payment/create-order', {
        user_id: userId,
        amount: orderSummary.total,
        currency: 'INR'
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message);
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: 'Your Company Name',
        description: 'Purchase Payment',
        order_id: orderResponse.data.order_id,
        handler: async function (response) {
          try {
            // Simplify the items structure to match backend expectations
            const formattedItems = cartItems.map(item => {
              const productId = item.product_id?._id || item.product_id;
              const name = item._display?.name || item.product_id?.name || 'Product';
              const price = Number(item.price);
              const quantity = Number(item.quantity);

              return {
                product_id: productId,
                name: name,
                variant_name: item.variant_name,
                quantity: quantity,
                price: price,
                total_price: price * quantity
              };
            });
            const verificationPayload = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              user_id: userId,
              order_details: {
                items: cartItems.map(item => {
                  // Get the product name from the appropriate source
                  const productName = item.product_id?.name || 
                                     item._display?.name || 
                                     'Unknown Product';
                  
                  return {
                    product_id: item.product_id?._id || item.product_id,
                    product_name: productName, // Make sure this is set
                    name: productName, // Include both for safety
                    variant_name: item.variant_name || '50ml',
                    quantity: Number(item.quantity),
                    price: Number(item.price),
                    total_price: Number(item.price * item.quantity)
                  };
                }),
                shipping_address: selectedAddress,
                total_amount: Number(orderSummary.total),
                payment_method: 'razorpay',
                payment_status: 'completed',
                order_status: 'confirmed'
              }
            };
            
            console.log('Sending verification payload:', verificationPayload);


            const verificationResponse = await axiosInstance.post('/payment/verify', verificationPayload);

            if (verificationResponse.data.success) {
              if (userString) {
                await clearCart(userId);
              } else {
                localStorage.removeItem('guestCart');
              }
              toast.success('Payment successful!');
              navigate('/order-success');
            } else {
              throw new Error(verificationResponse.data.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error(error.message || 'Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: userInfo?.name || '',
          email: userInfo?.email || '',
          contact: selectedAddress?.phone || selectedAddress?.phone_number || ''
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error(error.message || 'Payment initiation failed');
    }
  };

  const calculateOrderSummary = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);

    const shipping = 103.50;
    const vat = subtotal * 0.18; // 18% VAT
    let discount = 0;

    if (appliedOffer) {
      discount = (subtotal * appliedOffer.discount_percentage) / 100;
    }

    const total = subtotal + shipping + vat - discount;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      vat: vat.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  useEffect(() => {
    const summary = calculateOrderSummary();
    setOrderSummary(summary);
  }, [cartItems, appliedOffer]);

  const handlePlaceOrder = () => {
    if (selectedPaymentMethod === 'razorpay') {
      initiatePayment();
    } else if (selectedPaymentMethod === 'cod') {
      handleCODPayment();
    }
  };

  const renderAddressCards = () => {
    return userInfo.address.map((address, index) => (
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
          <label className="form-check-label ms-2" htmlFor={`address${index}`} style={{ color: '#000000' }}>
            <strong className="d-block mb-2" style={{ color: '#000000' }}>{address.firstName} {address.lastName}</strong>
            <span className="d-block" style={{ color: '#000000' }}>{address.street}, {address.house}</span>
            <span className="d-block" style={{ color: '#000000' }}>{address.postcode}, {address.location}</span>
            <span className="d-block" style={{ color: '#000000' }}>{address.country}</span>
          </label>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    loadRazorpayScript().catch(error => {
      console.error('Failed to load Razorpay on mount:', error);
    });

    // Cleanup on unmount
    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  useEffect(() => {
    console.log('Order Summary Updated:', orderSummary);
    console.log('Applied Offer Updated:', appliedOffer);
  }, [orderSummary, appliedOffer]);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    setIsGuestUser(!userString);

    const fetchAddresses = async () => {
      if (userString) {
        const userData = JSON.parse(userString);
        const userId = userData.user?.id || userData.id;
        if (userId) {
          try {
            const response = await axiosInstance.get(`/users/${userId}/addresses`);
            setUserInfo({ ...userInfo, address: response.data.addresses });
            if (response.data.addresses.length > 0) {
              setSelectedAddress(response.data.addresses[0]); // Set the first address as selected
            }
          } catch (error) {
            console.error('Error fetching addresses:', error);
            toast.error('Failed to fetch addresses. Please try again.');
          }
        }
      }
    };

    fetchAddresses();
  }, [navigate, orderSummary.shipping, addressesUpdated]);

  const isAddressSelected = () => {
    return selectedAddress && Object.keys(selectedAddress).length > 0;
  };

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
      {!isMobile && <Header />}
      {isMobile && (
        <div className="mobile-checkout-header">
          <div className="step-indicator">
            <span 
              onClick={() => {
                if (currentStep > 1) {
                  if (showPaymentMethods) {
                    setShowPaymentMethods(false);
                  } else {
                    setCurrentStep(currentStep - 1);
                  }
                } else {
                  navigate(-1);
                }
              }} 
              className="back-button"
            >
              ←
            </span>
            <h1>Checkout</h1>
            <span className="step-count">Step {currentStep}/3</span>
          </div>
        </div>
      )}
      
      <div className="container-fluid">
        {isMobile ? (
          <div className="mobile-checkout-steps">
            {currentStep === 1 && (
              <div className="step-content">
                <h2>Delivery Address</h2>
                {userInfo && userInfo.address && userInfo.address.length > 0 && !showAddressForm ? (
                  <div>
                    {userInfo.address.map((address, index) => (
                      <div
                        key={index}
                        className={`address-card ${selectedAddress === address ? 'selected' : ''}`}
                        onClick={() => handleAddressSelection(address)}
                      >
                        <p>{address.fullName}</p>
                        <p>{address.addressLine1}</p>
                        <p>{address.city}, {address.state} {address.pinCode}</p>
                        <p>{address.phone}</p>
                      </div>
                    ))}
                    <button onClick={() => setShowAddressForm(true)} className="btn btn-dark w-100 mt-3">
                      Add New Address
                    </button>
                  </div>
                ) : (
                  <PersonalInfoForm
                    initialData={userInfo}
                    onSubmit={handlePersonalInfoSubmit}
                    isLoggedIn={!isGuestUser}
                  />
                )}
              </div>
            )}
            
            {currentStep === 2 && addressSelected && !showPaymentMethods && (
              <div className="step-content">
                <h2>Select Payment Method</h2>
                <div className="payment-methods">
                  <div 
                    className="payment-method-option"
                    onClick={() => handlePaymentMethodSelect('razorpay')}
                  >
                    <div className="payment-logo-container">
                      <img src="/images/razor-pay.png" alt="Razor Pay" className="payment-logo" />
                    </div>
                    <span className="payment-name">Razor Pay</span>
                    <input
                      type="radio"
                      checked={selectedPaymentMethod === 'razorpay'}
                      readOnly
                    />
                  </div>
                  <div 
                    className="payment-method-option"
                    onClick={() => handlePaymentMethodSelect('cod')}
                  >
                    <div className="payment-logo-container">
                      <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <span className="payment-name">Cash on Delivery</span>
                    <input
                      type="radio"
                      checked={selectedPaymentMethod === 'cod'}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && addressSelected && selectedPaymentMethod && (
              <div className="step-content">
                <h2>Order Summary</h2>
                <div className="selected-payment-method mb-3">
                  <h3 className="mb-2">Payment Method</h3>
                  <div className="selected-method">
                    {selectedPaymentMethod === 'razorpay' ? (
                      <div className="d-flex align-items-center">
                        <img src="/images/razor-pay.png" alt="Razor Pay" className="payment-logo me-2" style={{height: '24px'}} />
                        <span>Razor Pay</span>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center">
                        <i className="fas fa-money-bill-wave me-2"></i>
                        <span>Cash on Delivery</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="products-list">
                  {cartItems.map((item, index) => {
                    const image = item._display?.image_urls?.[0] || 
                                item.product_id?.image_urls?.[0] || 
                                '/placeholder-image.jpg';
                    
                    const name = item._display?.name || 
                               item.product_id?.name || 
                               'Product Name';
                    
                    const description = item._display?.description || 
                                     item.product_id?.description || 
                                     'No description available';
                    
                    const price = parseFloat(item.price) || 0;

                    return (
                      <ProductItem
                        key={`${item.product_id?._id || item.product_id}-${index}`}
                        image={image}
                        quantity={item.quantity}
                        description={description}
                        name={name}
                        subDescription={item.product_id?.subDescription || ''}
                        price={price}
                      />
                    );
                  })}
                </div>
                <div className="order-summary-details">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{orderSummary.subtotal}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>₹{orderSummary.shipping}</span>
                  </div>
                  <div className="summary-row">
                    <span>VAT (18%)</span>
                    <span>₹{orderSummary.vat}</span>
                  </div>
                  {parseFloat(orderSummary.discount) > 0 && (
                    <div className="summary-row discount">
                      <span>Discount</span>
                      <span>-₹{orderSummary.discount}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>₹{orderSummary.total}</span>
                  </div>
                </div>
                <button 
                  className="btn btn-primary w-100 mt-3"
                  onClick={handlePlaceOrder}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? 'Processing...' : `Place Order (₹${orderSummary.total})`}
                </button>
              </div>
            )}
          </div>
        ) : (
          // Desktop layout remains unchanged
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
                      {renderAddressCards()}
                      <button onClick={handleAddNewAddress} className="btn btn-dark w-100 py-2">Add New Address</button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="mb-4">Add New Address</h3>
                      <PersonalInfoForm 
                        initialData={userInfo} 
                        onSubmit={handlePersonalInfoSubmit}
                        isLoggedIn={!isGuestUser}
                      />
                    </div>
                  )}
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                  <div className='payment-options p-4 bg-light rounded shadow-sm'>
                    <h3 className="mb-4">Payment Method</h3>
                    <div className='payment-method d-flex align-items-center mb-3'>
                      <div className="payment-logo-container me-3">
                        <img src="/images/razor-pay.png" alt="Razor Pay" className="payment-logo" style={{maxWidth: '100px'}} />
                      </div>
                      <span className="payment-name me-3">Razor Pay</span>
                      <input 
                        type="radio" 
                        className="payment-radio form-check-input" 
                        checked={selectedPaymentMethod === 'razorpay'}
                        onChange={() => handlePaymentMethodChange('razorpay')}
                      />
                    </div>
                    <div className='payment-method d-flex align-items-center'>
                      <div className="payment-logo-container me-3">
                      </div>
                      <span className="payment-name me-3">Cash on Delivery</span>
                      <input 
                        type="radio" 
                        className="payment-radio form-check-input" 
                        checked={selectedPaymentMethod === 'cod'}
                        onChange={() => handlePaymentMethodChange('cod')}
                      />
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
                        {cartItems.map((item, index) => {
                          // Handle both guest cart and logged-in user cart structures
                          const image = item._display?.image_urls?.[0] || 
                                        item.product_id?.image_urls?.[0] || 
                                        '/placeholder-image.jpg';
                          
                          const name = item._display?.name || 
                                       item.product_id?.name || 
                                       'Product Name';
                          
                          const description = item._display?.description || 
                                             item.product_id?.description || 
                                             'No description available';

                          return (
                            <ProductItem
                              key={`${item.product_id?._id || item.product_id}-${index}`}
                              image={image}
                              quantity={item.quantity}
                              description={description}
                              name={name}
                              subDescription={item.product_id?.subDescription || ''}
                              price={item.price}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <OfferSection onApplyOffer={applyOffer} appliedOffer={appliedOffer} />
                    <TotalSummary 
                      subtotal={orderSummary.subtotal}
                      shipping={orderSummary.shipping}
                      total={orderSummary.total}
                      vat={orderSummary.vat}
                      discount={orderSummary.discount}
                      appliedOffer={appliedOffer}
                      onCheckout={initiatePayment}
                      isPaymentDisabled={!isAddressSelected()}
                      selectedPaymentMethod={selectedPaymentMethod}
                      isGuestUser={isGuestUser}
                      isProcessingPayment={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {!isMobile && (
        <>
          <Touch/>
          <Footer/>
        </>
      )}
    </div>
  );
};

export default CheckOut;