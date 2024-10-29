import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart, FaHeart, FaStar } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import '../../Assets/Css/ProductPage/ProductCard.scss';
import { API_URL } from '../../config/api';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      checkIfFavorite(user.user.id, product._id);
    }
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

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
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

  const handleCardClick = () => {
    console.log('Handling card click for product:', product);
    if (product.slug && !isOutOfStock) {
      navigate(`/product/${product.slug}`);
    } else if (isOutOfStock) {
      toast.error('This product is currently out of stock');
    } else {
      console.error('Invalid product data:', product);
      toast.error('Unable to view product details. Please try again later.');
    }
  };

  // Find the 50ml variant or the first available variant
  const defaultVariant = product.variants.find(v => v.name === '50ml') || product.variants[0];

  // Check if all variants are out of stock
  const isOutOfStock = product.variants.every(v => v.stock_quantity === 0);

  return (
    <div className={`col-lg-4 col-md-6 mb-4 ${isOutOfStock ? 'out-of-stock' : ''}`} onClick={handleCardClick}>
      <div className="card h-100" tabIndex="-1">
        <div onClick={handleFavoriteClick} style={{ position: 'relative', zIndex: 2 }}>
          {isFavorite ? (
            <FaHeart className="heart-icon position-absolute" style={{ color: 'red' }} />
          ) : (
            <FaRegHeart className="heart-icon position-absolute" style={{ color: '#333' }} />
          )}
        </div>

        <div className="image-container">
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="card-img-top no-outline"
            style={{ height: '302px', objectFit: 'cover' }}
          />
          {isOutOfStock && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}
        </div>
        <div className="card-body p-4">
          <div className="card-category-rating">
            <p>{product.category}</p>
            <div className="rating-section">
              <FaStar className="star-icon" />
              <span className="rating-text">{product.rating}</span>
            </div>
          </div>
          <h5 className="card-title1">{product.name}</h5>
          <p className="card-text1">Rs: {defaultVariant ? defaultVariant.price : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;