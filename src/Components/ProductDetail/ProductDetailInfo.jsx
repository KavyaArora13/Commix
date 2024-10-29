import React, { useState, useEffect } from 'react';
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

const ProductDetailInfo = ({ product }) => {
  const dispatch = useDispatch();
  
  // Find the 50ml variant or use the first available variant
  const defaultVariant = product.variants?.find(v => v.name === '50ml') || 
                        product.variants?.[0] || 
                        { name: '50ml', price: 0 };

  // Add state for quantity
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [showMoreInfo, setShowMoreInfo] = useState({ 0: false, 1: false });
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // Update selected variant when product changes
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
      const userString = localStorage.getItem('user');
      if (!userString) {
        toast.error('Please log in to add items to cart');
        return;
      }
      const user = JSON.parse(userString);

      if (!selectedVariant) {
        toast.error('Please select a variant');
        return;
      }

      // Check stock availability
      if (selectedQuantity > selectedVariant.stock_quantity) {
        toast.error(`Only ${selectedVariant.stock_quantity} items available in stock`);
        return;
      }

      const response = await axios.post(`${API_URL}/cart/add`, {
        user_id: user.user.id,
        product_id: product._id,
        variant_name: selectedVariant.name,
        quantity: selectedQuantity
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
          <div className="quantity-selector mb-3">
            <label htmlFor="quantity" className="me-2">Quantity:</label>
            <select
              id="quantity"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(Number(e.target.value))}
              className="form-select form-select-sm"
              style={{ width: 'auto', display: 'inline-block' }}
            >
              {[...Array(Math.min(9, selectedVariant.stock_quantity || 1))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <h2 className="price">Rs: {selectedVariant.price}</h2>
          <div className="variants-selection mt-2">
            {product.variants && product.variants.length > 0 ? (
              product.variants.map((variant) => (
                <button
                  key={variant.name}
                  className={`variant-btn ${selectedVariant.name === variant.name ? 'active' : ''}`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  {variant.name} - Rs: {variant.price}
                </button>
              ))
            ) : (
              <button
                className="variant-btn active"
                disabled
              >
                50ml - Rs: 0
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="row mt-3 ms-1">
        <div className="col-lg-8 col-sm-12 col-md-8 promotion-section p-3">
          <div className="promotion-content d-flex align-items-center justify-content-between">
            {/* Add dynamic promotion content here if needed */}
          </div>
        </div>
      </div>

      <div className="row ms-1">
        <div className="col-lg-8 col-sm-12 col-md-8 border-div"></div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-8 col-sm-12 col-md-8 offer-section p-3">
          <h4>AVAILABLE OFFERS!</h4>

          {offers.map((offer, index) => (
            <div key={offer._id} className={`offer-item ${showMoreInfo[index] ? 'expanded' : ''}`}>
              <FontAwesomeIcon icon={faCircle} className="offer-dot" />
              <span className="offer-text ms-1">
                {offer.description}
              </span>
              <br />
              <button className="btn btn-link" onClick={() => handleToggleInfo(index)}>
                Know More
              </button>
              <div className="offer-details">
                <p><strong>Terms & Conditions :</strong> {offer.terms}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="row mt-3 add-to-bag-section">
        <div className="col-2 col-sm-2 col-lg-1 d-flex justify-content-center">
          <button className="wishlist-btn" onClick={handleToggleFavorite}>
            <FontAwesomeIcon icon={isFavorite ? fasHeart : farHeart} className={isFavorite ? 'text-danger' : ''} />
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
    </div>
  );
};

export default ProductDetailInfo;
