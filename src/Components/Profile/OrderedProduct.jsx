import React from 'react';
import { Link } from 'react-router-dom';
import '../../Assets/Css/Profile/OrderedProduct.scss';

const OrderedProduct = ({ 
  image, 
  title, 
  seller, 
  price, 
  originalPrice, 
  quantity, 
  slug, 
  productId,
  handleOpenReviewModal
}) => {
  const openReviewModal = () => {
    console.log('openReviewModal called for:', { id: productId, name: title });
    handleOpenReviewModal({ id: productId, name: title, image, price });
  };

  return (
    <div className="ordered-product">
      <div className="product-image-container">
        <img src={image} alt={title} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p className="product-seller">Sold by: {seller}</p>
        <p className="product-price">
          ${price}
          {originalPrice && <span className="original-price">${originalPrice}</span>}
        </p>
        <Link to={`/product/${slug}`} className="ask-question">Product question? Ask Seller</Link>
        <div className="product-actions">
          <button className="buy-again">Buy it Again</button>
          <button className="action-button">Return or replace items</button>
          <button className="action-button" onClick={openReviewModal}>
            Write a product review
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderedProduct;
