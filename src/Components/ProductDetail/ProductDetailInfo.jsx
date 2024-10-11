import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import '../../Assets/Css/ProductDetail/ProductDetailInfo.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../config/api';

const ProductDetailInfo = ({ product }) => {
  const [showMoreInfo, setShowMoreInfo] = useState({ 0: false, 1: false });
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleToggleInfo = (index) => {
    setShowMoreInfo((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleAddToBag = async () => {
    setIsAddingToCart(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        toast.error('Please log in to add items to your cart');
        return;
      }

      await axios.post(`${API_URL}/cart/add`, {
        user_id: user.user.id,
        product_id: product._id,
        quantity: 1
      });

      // Show a simple success message
      toast.success('Product added to your cart!');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      toast.error('Failed to add product to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="product-detail-info">
      {/* Product Title and Share */}
      <div className="row product-detail-header align-items-center">
        <div className="col-9 col-sm-6 col-md-9 col-lg-10">
          <h1 className="product-title">{product.name}</h1>
        </div>
        <div className="col-3 col-sm-6 col-md-3 col-lg-2 text-end">
          <button className="btn btn-outline-secondary share-btn">Share</button>
        </div>
      </div>

      {/* Star Rating and Reviews */}
      <div className="row mt-3">
        <div className="col-sm-12 d-flex align-items-start rating-section">
          <div className="star-rating p-1">
            <FontAwesomeIcon icon={faStar} className="star-icon" />
            <span className="rating-text">{product.rating}</span>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="row mt-3">
        <div className="col-sm-12">
          <h2 className="price">Rs:{product.price}</h2>
        </div>
      </div>

      {/* Promotion Section */}
      <div className="row mt-3 ms-1">
        <div className="col-lg-8 col-sm-12 col-md-8 promotion-section p-3">
          <div className="promotion-content d-flex align-items-center justify-content-between">
            <div className="promo-left col-lg-9 col-sm-8">
              <span className="price-tag p-1">PRICE</span>
              <span className="promo-text">
                <strong>$199</strong> <span className="promo-discount">(SAVE 20%)</span> + FREE Shipping
              </span>
            </div>
            <button className="btn btn-dark join-now-btn col-lg-3 col-sm-4">JOIN NOW</button>
          </div>
        </div>
      </div>

      <div className="row ms-1">
        <div className="col-lg-8 col-sm-12 col-md-8 border-div"></div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-8 col-sm-12 col-md-8 offer-section p-3">
          <h4>AVAILABLE OFFERS!</h4>

          {/* First Offer */}
          <div className={`offer-item ${showMoreInfo[0] ? 'expanded' : ''}`}>
            <FontAwesomeIcon icon={faCircle} className="offer-dot" />
            <span className="offer-text ms-1">
              FREE Teal Trousseau Box Free On Orders Above 1499
            </span>
            <br />
            <button className="btn btn-link" onClick={() => handleToggleInfo(0)}>
              Know More
            </button>
            <div className="offer-details">
              <p><strong>Terms & Conditions :</strong> Two Offers Cannot Be Clubbed.</p>
            </div>
          </div>

          {/* Second Offer */}
          <div className={`offer-item  ${showMoreInfo[1] ? 'expanded' : ''}`}>
            <FontAwesomeIcon icon={faCircle} className="offer-dot" />
            <span className="offer-text ms-1">
              Giva Silver Pendant Complimentary On Your SUGAR Order Worth Rs.2499
            </span>
            <br />
            <button className="btn btn-link" onClick={() => handleToggleInfo(1)}>
              Know More
            </button>
            <div className="offer-details">
              <p><strong>Terms & Conditions :</strong> Two Offers Cannot Be Clubbed.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3 add-to-bag-section">
        <div className="col-2 col-sm-2 col-lg-1 d-flex justify-content-center">
          <button className="wishlist-btn">
            <FontAwesomeIcon icon={farHeart} />
          </button>
        </div>
        <div className="col-10 col-sm-10 col-lg-3 d-flex justify-content-center">
          <button 
            className="btn btn-dark add-to-bag-btn" 
            onClick={handleAddToBag}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? 'ADDING...' : 'ADD TO BAG'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailInfo;