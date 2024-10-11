import React from 'react';
import '../../Assets/Css/CheckOut/ProductItem.scss';

const ProductItem = ({ image, quantity, description, name, subDescription, price }) => {
  return (
    <div className="product-item">
      <div className="product-item-details">
        <img src={image} alt={name} className="product-item-image" />
        <div className="product-item-info">
          <p className="product-item-quantity">{quantity}x</p>
          <p className="product-item-description">{description}</p>
          <p className="product-item-name">{name}</p>
          <p className="product-item-sub-description">{subDescription}</p>
        </div>
      </div>
      <p className="product-item-price">{price.toFixed(2)}</p>
    </div>
  );
};

export default ProductItem;