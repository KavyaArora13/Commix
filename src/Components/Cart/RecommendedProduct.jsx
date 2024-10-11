import React from 'react';
import '../../Assets/Css/Cart/RecommendedProduct.scss';

const RecommendedProduct = ({ image, title, rating, reviewCount, price }) => {
  return (
    <div className="recommended-product d-flex mb-3">
      <div className="product-image me-3">
        <img src={image} alt={title} className="img-fluid" />
      </div>
      <div className="product-details">
        <h6 className="product-title">{title}</h6>
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? "star filled" : "star"}>★</span>
          ))}
          <span className="review-count">({reviewCount})</span>
        </div>
        <p className="product-price mb-1">${price.toFixed(2)}</p>
        <button className="btn btn-sm btn-warning">Add to Cart</button>
      </div>
    </div>
  );
};

export default RecommendedProduct;