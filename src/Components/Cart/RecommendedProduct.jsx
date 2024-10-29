import React from 'react';
import { Link } from 'react-router-dom';
import '../../Assets/Css/Cart/RecommendedProduct.scss';

const RecommendedProduct = ({ product }) => {
  if (!product) return null;

  const discountedPrice = product.price * (1 - (product.discount_percentage || 0) / 100);

  return (
    <div className="recommended-product d-flex align-items-center mb-2 p-2 border">
      <div className="product-image me-3" style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
        <img 
          src={product.image_urls[0] || 'placeholder-image-url'} 
          alt={product.name} 
          className="img-fluid" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="product-details flex-grow-1">
        <h6 className="product-title mb-1" style={{ fontSize: '0.9rem' }}>{product.name}</h6>
        <div className="product-rating mb-1" style={{ fontSize: '0.8rem' }}>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < Math.round(product.rating) ? 'gold' : 'lightgray' }}>★</span>
          ))}
          <span className="ms-1">{product.sales}</span>
        </div>
        <p className="product-price mb-1" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>${discountedPrice.toFixed(2)}</p>
        <Link to={`/product/${product.slug}`} className="btn btn-sm btn-warning" style={{ fontSize: '0.8rem' }}>View Product</Link>
      </div>
    </div>
  );
};

export default RecommendedProduct;
