import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import '../../Assets/Css/ProductDetail/ProductDetailInfo.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../config/api';
import { useDispatch } from 'react-redux';
import { updateCartItemCount } from '../../features/cart/cartSlice';
import { addToGuestCart } from '../../services/guestCartService';

const ProductDetailInfo = forwardRef(({ product, isMobile }, ref) => {
  const dispatch = useDispatch();
  
  const defaultVariant = product.variants?.find(v => v.name === '50ml') || 
                        product.variants?.[0] || 
                        { name: '50ml', price: 0 };

  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [showMoreInfo, setShowMoreInfo] = useState({ 0: false, 1: false });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const default50mlVariant = product.variants?.find(v => v.name === '50ml') || 
                              product.variants?.[0] || 
                              { name: '50ml', price: 0 };
    setSelectedVariant(default50mlVariant);
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      checkIfFavorite(user.user.id, product._id);
    }
    fetchOffers();
  }, [product]);

  const checkIfFavorite = async (userId, productId) => {
    try {
      const response = await axios.get(`${API_URL}/favorites/check`, {
        params: { user_id: userId, product_id: productId }
      });
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`${API_URL}/offers`);
      setOffers(response.data.offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const handleToggleInfo = (index) => {
    setShowMoreInfo((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleAddToBag = async () => {
    try {
      setIsAddingToCart(true);

      if (!selectedVariant) {
        toast.error('Please select a variant');
        return;
      }

      // Check stock availability
      if (selectedVariant.stock_quantity < 1) {
        toast.error(`Out of stock`);
        return;
      }

      const userString = localStorage.getItem('user');
      
      if (!userString) {
        // Handle guest cart
        const updatedCart = addToGuestCart(
          product,
          selectedVariant,
          1
        );
        
        // Update cart count in redux store for guest
        const newCount = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        dispatch(updateCartItemCount(newCount));
        
        toast.success('Added to cart successfully');
        return;
      }

      // Handle logged-in user cart
      const user = JSON.parse(userString);
      const response = await axios.post(`${API_URL}/cart/add`, {
        user_id: user.user.id,
        product_id: product._id,
        variant_name: selectedVariant.name,
        quantity: 1
      });

      if (response.data.cartItem) {
        toast.success('Added to cart successfully');
        const newCount = await fetchCartItemCount(user.user.id);
        dispatch(updateCartItemCount(newCount));
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to add to cart. Please try again.');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  // Helper function to fetch the current cart item count
  const fetchCartItemCount = async (userId) => {
    try {
      const userString = localStorage.getItem('user');
      
      if (!userString) {
        // For guest users, get cart from localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        return guestCart.reduce((sum, item) => sum + item.quantity, 0);
      }

      // For logged-in users, get cart from API
      const response = await axios.get(`${API_URL}/cart/${userId}`);
      return response.data.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    } catch (error) {
      console.error('Failed to fetch cart item count:', error);
      return 0;
    }
  };

  const handleToggleFavorite = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Please log in to manage favorites');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`${API_URL}/favorites/delete`, {
          data: {
            user_id: user.user.id,
            product_id: product._id
          }
        });
        setIsFavorite(false);
        toast.success('Product removed from favorites!');
      } else {
        await axios.post(`${API_URL}/favorites/add`, {
          user_id: user.user.id,
          product_id: product._id
        });
        setIsFavorite(true);
        toast.success('Product added to favorites!');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites. Please try again.');
    }
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    handleAddToBag,
    handleToggleFavorite,
    isFavorite,
    isAddingToCart,
    selectedVariant
  }));

  return (
    <div className="product-detail-info">
      <div className="row product-detail-header align-items-center">
        <div className="col-9 col-sm-6 col-md-9 col-lg-10">
          <h1 className="product-title">{product.name}</h1>
        </div>
        <div className="col-3 col-sm-6 col-md-3 col-lg-2 text-end">
          <button className="btn btn-outline-secondary share-btn">Share</button>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-sm-12">
          <h2 className="price">Rs: {selectedVariant.price}</h2>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12">
          <div className="border-div">
            {product.variants && product.variants.length > 0 ? (
              product.variants.map((variant) => (
                <div
                  key={variant.name}
                  className={`variant-item ${selectedVariant.name === variant.name ? 'active' : ''}`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  <span className="variant-name">{variant.name}</span>
                </div>
              ))
            ) : (
              <div className="variant-item active">
                <span className="variant-name">50ml</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="offer-section">
          <h4>AVAILABLE OFFERS!</h4>
          {offers.map((offer, index) => (
            <div key={offer._id} className="offer-item">
              <div className="offer-text">
                <FontAwesomeIcon icon={faCircle} className="offer-dot" />
                <span>{offer.description}</span>
                <button onClick={() => handleToggleInfo(index)}>
                  {showMoreInfo[index] ? 'Show Less' : 'Know More'}
                </button>
              </div>
              {showMoreInfo[index] && (
                <div className="offer-details">
                  <p><strong>Terms & Conditions:</strong> {offer.terms}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {!isMobile && (
        <div className="row mt-3 add-to-bag-section">
          <div className="col-2 col-sm-2 col-lg-1 d-flex justify-content-center">
            <button className="wishlist-btn" onClick={handleToggleFavorite}>
              <FontAwesomeIcon 
                icon={isFavorite ? fasHeart : farHeart} 
                className={isFavorite ? 'text-danger' : ''} 
              />
            </button>
          </div>
          <div className="col-10 col-sm-10 col-lg-3 d-flex justify-content-center">
            <button 
              className="btn btn-dark add-to-bag-btn" 
              onClick={handleAddToBag}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? 'ADDING...' : 'ADD TO CART'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default ProductDetailInfo;
