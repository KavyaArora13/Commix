import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Assets/Css/Profile/OrderedProduct.scss';

const OrderedProduct = ({ image, title, seller, price, originalPrice, slug }) => {
  const navigate = useNavigate();

  const handleBuyAgain = () => {
    const productSlug = slug || title.toLowerCase().replace(/\s+/g, '-');
    navigate(`/product/${productSlug}`);
  };

  return (
    <div className="ordered-product">
      <div className="product-image-container">
        <img src={image} alt={title} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        <p className="product-seller">
          Sold by: {seller} | <span className="ask-seller">Product question? Ask Seller</span>
        </p>
        <p className="product-price">
          ${price} <span className="original-price">M.R.P.: ${originalPrice}</span>
        </p>
        <button className="buy-again-btn" onClick={handleBuyAgain}>Buy it Again</button>
      </div>
      <div className="product-actions">
        <button className="action-btn primary">Return or replace items</button>
        <button className="action-btn">Ask Product Question</button>
        <button className="action-btn">Leave seller feedback</button>
        <button className="action-btn">Write a product review</button>
      </div>
    </div>
  );
};

export default OrderedProduct;