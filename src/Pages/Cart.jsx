// src/Pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import CartProduct from '../Components/Cart/CartProduct';
import OrderSummary from '../Components/Cart/OrderSummary';
import RecommendedProduct from '../Components/Cart/RecommendedProduct';
import CardComponent from '../Components/ProductPage/CardComponent';
import { API_URL } from "../config/api";
import '../Assets/Css/Cart/Cart.scss';
import '../Assets/Css/ProductPage/ProductGridLayout.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { useDispatch } from 'react-redux';
import { updateCartItemCount } from '../features/cart/cartSlice';
import Touch from '../Components/Touch';
import { toast } from 'sonner';  // Change this import

const fetchCartItemCount = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/cart/${userId}`);
    return response.data.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error('Failed to fetch cart item count:', error);
    return 0;
  }
};

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCartData();
    fetchAllProducts();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [cartProducts]);

  const fetchCartData = async () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        throw new Error('User not found in localStorage');
      }
      const user = JSON.parse(userString);
      if (!user.user || !user.user.id) {
        throw new Error('Invalid user data in localStorage');
      }
      const response = await axios.get(`${API_URL}/cart/${user.user.id}`);
      setCartProducts(response.data.cartItems || []);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setCartProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = () => {
    const total = cartProducts.reduce((sum, item) => sum + (item.total_price || 0), 0);
    const count = cartProducts.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setSubtotal(total);
    setItemCount(count);
  };

  const getVariantStockQuantity = (product, variantName) => {
    if (product && product.variants) {
      const variant = product.variants.find(v => v.name === variantName);
      return variant ? variant.stock_quantity : 0;
    }
    return 0;
  };

  const handleQuantityChange = async (data) => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        toast.error('Please log in to update cart');
        return;
      }

      // Validate data
      if (!data.user_id || !data.product_id || !data.quantity || !data.variant_name) {
        toast.error('Missing required fields');
        return;
      }

      // Find the current item and its variant
      const currentItem = cartProducts.find(
        p => p.product_id._id === data.product_id && p.variant_name === data.variant_name
      );
      
      if (!currentItem) {
        toast.error('Item not found in cart');
        return;
      }

      const variant = currentItem.product_id.variants.find(v => v.name === data.variant_name);
      if (!variant) {
        toast.error('Product variant not found');
        return;
      }

      // Check stock availability
      if (data.quantity > variant.stock_quantity) {
        toast.error(`Only ${variant.stock_quantity} items available in stock`);
        return;
      }

      // Call the addToCart endpoint to update quantity
      await axios.post(`${API_URL}/cart/add`, {
        user_id: data.user_id,
        product_id: data.product_id,
        variant_name: data.variant_name,
        quantity: data.quantity
      });

      // Refresh cart data and update Redux store
      await fetchCartData();
      const newCount = await fetchCartItemCount(data.user_id);
      dispatch(updateCartItemCount(newCount));
      toast.success('Cart updated successfully');

    } catch (error) {
      console.error("Error updating quantity:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update quantity. Please try again.');
      }
    }
  };

  const handleDelete = async (productId, variantName, quantity) => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        toast.error('Please log in to remove items');
        return;
      }
      const user = JSON.parse(userString);
      
      await axios.post(`${API_URL}/cart/remove`, {
        user_id: user.user.id,
        product_id: productId,
        variant_name: variantName
      });
      
      // Update local state
      const updatedCartProducts = cartProducts.filter(item => 
        !(item.product_id._id === productId && item.variant_name === variantName)
      );
      setCartProducts(updatedCartProducts);
      
      // Update Redux store
      const newCount = await fetchCartItemCount(user.user.id);
      dispatch(updateCartItemCount(newCount));
      
      toast.success('Item removed from cart');
      
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/`);
      const allProducts = response.data.products;
      
      if (Array.isArray(allProducts)) {
        const cartProductIds = new Set(cartProducts.map(item => item.product_id._id));
        const availableProducts = allProducts.filter(product => !cartProductIds.has(product._id));
        
        const shuffled = availableProducts.sort(() => 0.5 - Math.random());
        
        setRecommendedProducts(shuffled.slice(0, 5));
        setBestSellers(shuffled.slice(5, 9));
      } else {
        console.error("Unexpected response format for products:", allProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProceedToBuy = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isCartEmpty = cartProducts.length === 0;

  return (
    <>
      <Header />
      <div className="container-fluid mt-3">
        <div className="cart-header">
          <h1>Cart</h1>
          <Link to="/" className="continue-shopping">
            <span>←</span>
            continue shopping
          </Link>
        </div>
        {isCartEmpty ? (
          <div className="empty-cart-message">
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart and come back here to complete your purchase!</p>
            <Link to="/" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-12 col-sm-12 col-md-8 col-lg-9 col-xl-9 mb-4">
              {cartProducts.map(product => (
                <CartProduct 
                  key={product._id}
                  product={product}
                  onQuantityChange={handleQuantityChange}
                  onDelete={() => handleDelete(product.product_id._id, product.variant_name, product.quantity)}
                />
              ))}
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <OrderSummary 
                subtotal={subtotal} 
                itemCount={itemCount} 
                onProceedToBuy={handleProceedToBuy}
              />
              <div className="recommended-products">
                <h5>Recommended Products</h5>
                {recommendedProducts.length > 0 ? (
                  <>
                    <div className="d-md-none">
                      <Swiper
                        modules={[Pagination]}
                        spaceBetween={15}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        className="mySwiper"
                      >
                        {recommendedProducts.map(product => (
                          <SwiperSlide key={product._id}>
                            <RecommendedProduct product={product} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                    <div className="d-none d-md-block recommended-product-list">
                      {recommendedProducts.map(product => (
                        <RecommendedProduct key={product._id} product={product} />
                      ))}
                    </div>
                  </>
                ) : (
                  <p>No recommended products available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {!isCartEmpty && (
        <div className="product-grid-layout container mt-5">
          <div className="row mt-5">
            <div className="col-lg-10 col-md-9 col-sm-12">
              <p className="section-subtitle">
                Top Seller
              </p>
              <h2 className="section-title">
                Explore Our Best Collections
              </h2>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-12 d-flex justify-content-end align-items-center">
              <Link to="/products" className="btn btn-dark view-all-button">VIEW ALL</Link>
            </div>
          </div>
          <div className='row mt-4'>
            {bestSellers.map((product) => (
              <div key={product._id} className="col-lg-3 col-md-6 col-sm-6 mb-4">
                <CardComponent
                  id={product._id}
                  image={product.image_urls[0]}
                  title={product.name}
                  price={product.variants && product.variants.length > 0 ? product.variants[0].price : 0}
                  description={product.description}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <Touch/>
      <Footer />
    </>
  );
};

export default Cart;
