// src/Assets/Css/ProductPage/CardComponent.scss
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
import 'swiper/css';
import 'swiper/css/pagination';
import { useDispatch } from 'react-redux';
import { updateCartItemCount } from '../features/cart/cartSlice';
import Touch from '../Components/Touch';
import { toast } from 'react-toastify';  
import { getGuestCart, addToGuestCart, removeFromGuestCart } from '../services/guestCartService';
import '../Assets/Css/ProductPage/CardComponent.scss'
import MobileCart from '../Components/Cart/MobileCart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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
    fetchBestSellers();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [cartProducts]);

  const fetchCartData = async () => {
    try {
      const userString = localStorage.getItem('user');
      
      if (!userString) {
        const guestCart = getGuestCart();
        console.log('Fetched guest cart items:', guestCart);
        setCartProducts(guestCart);
        return;
      }

      const userData = JSON.parse(userString);
      const userId = userData.user?.id || userData.id;
      
      if (!userId) {
        throw new Error('Invalid user ID');
      }

      const response = await axios.get(`${API_URL}/cart/${userId}`);
      console.log('Fetched cart items for logged-in user:', response.data.cartItems);
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
        const updatedCart = addToGuestCart(
          {
            _id: data.product_id,
            name: data.product_name,
            image_urls: data.image_urls,
            description: data.description,
            variants: data.variants
          },
          {
            name: data.variant_name,
            price: data.price
          },
          data.quantity,
          true
        );
        setCartProducts(updatedCart);
        dispatch(updateCartItemCount(updatedCart.reduce((sum, item) => sum + item.quantity, 0)));
        toast.success('Cart updated successfully');
        return;
      }

      const userData = JSON.parse(userString);
      const userId = userData.user?.id || userData.id;

      if (!userId) {
        toast.error('Invalid user data');
        return;
      }

      data.user_id = userId;
      const response = await axios.post(`${API_URL}/cart/add`, data);
      await fetchCartData();
      const newCount = await fetchCartItemCount(userId);
      dispatch(updateCartItemCount(newCount));
      toast.success('Cart updated successfully');

    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.message || 'Failed to update quantity');
    }
  };

  const handleDelete = async (productId, variantName) => {
    try {
      const userString = localStorage.getItem('user');
      
      if (!userString) {
        if (!productId || !variantName) {
          console.error('Missing required data:', { productId, variantName });
          toast.error('Unable to remove item: Missing data');
          return;
        }

        console.log('Deleting guest cart item:', { productId, variantName });
        const updatedCart = removeFromGuestCart(productId, variantName);
        console.log('Cart after deletion:', updatedCart);
        setCartProducts(updatedCart);
        const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        dispatch(updateCartItemCount(newCount));
        toast.success('Item removed from cart');
        return;
      }

      const userData = JSON.parse(userString);
      const userId = userData.user?.id || userData.id;

      if (!userId) {
        toast.error('Invalid user data');
        return;
      }

      const actualProductId = typeof productId === 'string' ? productId : productId._id;

      await axios.post(`${API_URL}/cart/remove`, {
        user_id: userId,
        product_id: actualProductId,
        variant_name: variantName
      });
      
      await fetchCartData();
      const newCount = await fetchCartItemCount(userId);
      dispatch(updateCartItemCount(newCount));
      toast.success('Item removed from cart');
      
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error('Failed to remove item from cart');
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

  const fetchBestSellers = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/`);
      if (response.data.success) {
        setBestSellers(response.data.products);
      } else {
        console.error('Failed to fetch best sellers');
      }
    } catch (err) {
      console.error('Error fetching best sellers:', err);
    }
  };

  const handleProceedToBuy = () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/checkout', { state: { isGuest: true } });
    } else {
      navigate('/checkout');
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/recommended-products`);
      const productsWithReviews = await Promise.all(response.data.map(async (product) => {
        const reviewsResponse = await axios.get(`${API_URL}/reviews/product/${product._id}`);
        const reviews = reviewsResponse.data.reviews;

        // Calculate average rating
        const averageRating = reviews.length > 0 
          ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
          : 0;

        return { ...product, averageRating, reviews };
      }));

      setRecommendedProducts(productsWithReviews);
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isCartEmpty = cartProducts.length === 0;

  return (
    <div className="cart-page">
      {/* Desktop Header */}
      <div className="desktop-header">
        <Header />
      </div>

      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-cart-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1>Shopping Cart</h1>
          <div className="spacer"></div>
        </div>
      </div>

      <div className="cart-container">
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
            <>
              {/* Mobile Cart */}
              <div className="d-block d-md-none">
                <MobileCart
                  cartProducts={cartProducts}
                  recommendedProducts={recommendedProducts}
                  handleQuantityChange={handleQuantityChange}
                  handleDelete={handleDelete}
                  subtotal={subtotal}
                  itemCount={itemCount}
                  onProceedToBuy={handleProceedToBuy}
                />
              </div>

              {/* Desktop Cart */}
              <div className="d-none d-md-block">
                <div className="row">
                  <div className="col-md-8 col-lg-9 col-xl-9 mb-4">
                    {cartProducts.map(product => (
                      <CartProduct 
                        key={`${product.product_id}-${product.variant_name}`}
                        product={product}
                        onQuantityChange={handleQuantityChange}
                        onDelete={() => handleDelete(product.product_id, product.variant_name)}
                      />
                    ))}
                  </div>
                  <div className="col-md-4 col-lg-3 col-xl-3">
                    <OrderSummary 
                      subtotal={subtotal} 
                      itemCount={itemCount} 
                      onProceedToBuy={handleProceedToBuy}
                    />
                    <div className="recommended-products">
                      <h5>Recommended Products</h5>
                      {recommendedProducts.length > 0 ? (
                        <div className="recommended-product-list">
                          {recommendedProducts.map(product => (
                            <RecommendedProduct key={product._id} product={product} />
                          ))}
                        </div>
                      ) : (
                        <p>No recommended products available.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
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
                <Link to="/product" className="btn btn-dark view-all-button">VIEW ALL</Link>
              </div>
            </div>
            <div className='row mt-4'>
              {bestSellers.map((product) => (
                <CardComponent
                  key={product._id}
                  image={product.image_urls[0]}
                  title={product.name}
                  price={product.variants && product.variants.length > 0 ? product.variants[0].price : 'N/A'}
                  description={product.description}
                  slug={product.slug}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Touch/>
      <Footer />
    </div>
  );
};

export default Cart;
