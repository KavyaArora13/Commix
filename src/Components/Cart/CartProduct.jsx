// src/Components/Cart/CartProduct.jsx
import React from 'react';
import '../../Assets/Css/Cart/CartProduct.scss';

const CartProduct = ({ product, onQuantityChange, onDelete }) => {
  if (!product) {
    return null;
  }

  // Handle both guest cart and logged-in user cart structures
  const productId = product.product_id?._id || product.product_id;
  
  // Handle display data for both structures
  const displayData = product._display || {
    name: product.product_id?.name || 'Unknown Product',
    image_urls: product.product_id?.image_urls || [],
    description: product.product_id?.description || 'No description available',
    variants: product.product_id?.variants || []
  };
  
  // Log the product and display data
  console.log('Product data:', product);
  console.log('Display data:', displayData);

  // Define maxQuantity and create quantity options array
  const maxQuantity = 9;
  const quantityOptions = Array.from({ length: maxQuantity }, (_, i) => i + 1);

  // Define handleQuantityChange function
  const handleQuantityChange = (newQuantity) => {
    onQuantityChange({
      product_id: productId,
      variant_name: product.variant_name,
      product_name: displayData.name,
      quantity: newQuantity,
      price: product.price,
      image_urls: displayData.image_urls,
      description: displayData.description,
      variants: displayData.variants,
      total_price: newQuantity * product.price
    });
  };

  // Define handleDelete function
  const handleDelete = (e) => {
    e.preventDefault();
    if (!productId) {
      console.error('No product ID found:', product);
      return;
    }
    
    console.log('Deleting product:', {
      productId,
      variant_name: product.variant_name,
      product: product
    });
    
    onDelete(productId, product.variant_name);
  };

  return (
    <div className="cart-product border p-3 mb-3">
      <div className="row align-items-start">
        <div className="col-2">
          <img 
            src={displayData.image_urls?.[0] || '/placeholder-image.jpg'} 
            alt={displayData.name} 
            className="img-fluid" 
          />
        </div>

        <div className="col-8">
          <h5 className="cart-product-title">{displayData.name}</h5>
          <p className="cart-product-variant mb-1">{product.variant_name}</p>
          <div className="mobile-price-info">
            <p className="cart-product-total-price">Rs. {product.total_price.toFixed(2)}</p>
            <p className="cart-product-unit-price">Rs. {product.price.toFixed(2)} / item</p>
          </div>
          
          <div className="desktop-only">
            <div className="cart-product-options mb-1">
              <input type="checkbox" id={`gift-${productId}-${product.variant_name}`}/>
              <label htmlFor={`gift-${productId}-${product.variant_name}`} className="ms-2">
                This will be a gift <a href="#" className="learn-more">Learn more</a>
              </label>
            </div>
          </div>

          <div className="cart-product-actions mb-2">
            <div className="quantity-selector me-3">
              <label>Qty:</label>
              <select 
                value={product.quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              >
                {quantityOptions.map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <a href="#" onClick={handleDelete} className="me-2">Delete</a>
            <a href="#" className="me-2">Save for later</a>
            <a href="#" className="me-2 desktop-only">See more like this</a>
            <a href="#" className="desktop-only">Share</a>
          </div>

          <p className="cart-product-description mb-0 desktop-only">
            Description: {displayData.description || 'No description available'}
          </p>
        </div>

        <div className="col-2 text-end desktop-only">
          <p className="cart-product-price mb-0">Rs. {product.total_price.toFixed(2)}</p>
          <p className="mb-0">Price per item: Rs. {product.price.toFixed(2)}</p>
          <p className="mb-0">Quantity: {product.quantity}</p>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
