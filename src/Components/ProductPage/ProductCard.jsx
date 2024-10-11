import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart, FaHeart, FaStar } from 'react-icons/fa';
import '../../Assets/Css/ProductPage/ProductCard.scss';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
  };

  const handleCardClick = () => {
    if (product.slug) {
      navigate(`/product/${product.slug}`);
    } else {
      console.error('Product slug is undefined');
    }
  };

  return (
    <div className="col-lg-4 col-md-6 mb-4" onClick={handleCardClick}>
      <div className="card h-100" tabIndex="-1">
        <div onClick={handleFavoriteClick} style={{ position: 'relative', zIndex: 2 }}>
          {isFavorite ? (
            <FaHeart className="heart-icon position-absolute" style={{ color: 'red' }} />
          ) : (
            <FaRegHeart className="heart-icon position-absolute" style={{ color: '#333' }} />
          )}
        </div>

        <img
          src={product.image_urls[0]}
          alt={product.name}
          className="card-img-top no-outline"
          style={{ height: '302px', objectFit: 'cover' }}
        />
        <div className="card-body p-4">
          <div className="card-category-rating">
            <p>{product.category}</p>
            <div className="rating-section">
              <FaStar className="star-icon" />
              <span className="rating-text">{product.rating}</span>
            </div>
          </div>
          <h5 className="card-title1">{product.name}</h5>
          <p className="card-text1">Rs: {product.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;