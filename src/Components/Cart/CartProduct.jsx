// src/Components/Cart/CartProduct.jsx
import React from 'react';
import '../../Assets/Css/Cart/CartProduct.scss';

const CartProduct = ({ product, onQuantityChange, onDelete }) => {
  if (!product || !product.product_id) {
    return null;
  }

  const handleQuantityChange = (newQuantity) => {
    onQuantityChange({
      user_id: JSON.parse(localStorage.getItem('user'))?.user?.id,
      product_id: product.product_id._id,
      variant_name: product.variant_name,
      quantity: newQuantity
    });
  };

  const handleDelete = () => {
    onDelete(product.product_id._id, product.variant_name, product.quantity);
  };

  // Find variant and set default values
  const variant = product.product_id.variants?.find(v => v.name === product.variant_name) || 
                 product.product_id.variants?.[0] || 
                 { name: '50ml', price: 0 };
  
  const price = variant?.price || 0;
  const quantity = product.quantity || 1;
  const totalPrice = price * quantity;
  const variantStock = variant?.stock_quantity || 0;
  const maxQuantity = Math.min(9, variantStock);
  const rating = product.product_id?.rating || 0;

  return (
    <div className="cart-product border p-3 mb-3">
      <div className="row align-items-start">
        <div className="col-2">
          <img src={product.product_id.image_urls?.[0] || 'placeholder-image-url'} 
               alt={product.product_id.name || 'Product'} 
               className="img-fluid" />
        </div>

        <div className="col-8">
          <h5 className="cart-product-title">{product.product_id.name || 'Unnamed Product'}</h5>
          <p className="cart-product-variant mb-1">{product.variant_name || '50ml'}</p>
          <div className="cart-product-options mb-1">
            <input type="checkbox" id={`gift-${product.product_id._id}-${product.variant_name}`}/>
            <label htmlFor={`gift-${product.product_id._id}-${product.variant_name}`} className="ms-2">
              This will be a gift <a href="#" className="learn-more">Learn more</a>
            </label>
          </div>

          <div className="cart-product-actions mb-2">
            <div className="quantity-selector me-3">
              <label htmlFor={`quantity-${product.product_id._id}-${product.variant_name}`}>Qty:</label>
              <select 
                name="quantity" 
                id={`quantity-${product.product_id._id}-${product.variant_name}`}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                disabled={variantStock === 0}
              >
                {[...Array(maxQuantity)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); handleDelete(); }} className="me-2">Delete</a>
            <a href="#" className="me-2">Save for later</a>
            <a href="#" className="me-2">See more like this</a>
            <a href="#">Share</a>
          </div>

          <p className="cart-product-description mb-0">
            Description: {product.product_id.description || 'No description available'}
          </p>
        </div>

        <div className="col-2 text-end">
          <p className="cart-product-price mb-0">Rs. {totalPrice.toFixed(2)}</p>
          <p className="mb-0">Price per item: Rs. {price.toFixed(2)}</p>
          <p className="mb-0">Quantity: {quantity}</p>
          <p className="mb-0">Rating: {rating.toFixed(1)}/5</p>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
