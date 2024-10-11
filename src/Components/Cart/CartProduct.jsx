import React from 'react';
import '../../Assets/Css/Cart/CartProduct.scss';

const CartProduct = ({ product, onQuantityChange, onDelete }) => {
  if (!product || !product.product_id) {
    return null;
  }

  const handleQuantityChange = (newQuantity) => {
    onQuantityChange(product.product_id._id, newQuantity);
  };

  const handleDelete = () => {
    onDelete(product.product_id._id);
  };

  const discountedPrice = product.price * (1 - product.product_id.discount_percentage / 100);

  return (
    <div className="cart-product border p-3 mb-3">
      <div className="row align-items-start">
        <div className="col-2">
          <img src={product.product_id.image_urls[0] || 'placeholder-image-url'} alt={product.product_id.name || 'Product'} className="img-fluid" />
        </div>

        <div className="col-8">
          <h5 className="cart-product-title">{product.product_id.name || 'Unnamed Product'}</h5>
          <p className="cart-product-stock text-success mb-1">
            {product.product_id.stock_quantity > 0 ? 'In stock' : 'Out of stock'}
          </p>
          <div className="cart-product-options mb-1">
            <input type="checkbox" id="gift"/>
            <label htmlFor="gift" className="ms-2">This will be a gift <a href="#" className="learn-more">Learn more</a></label>
          </div>
          <p className="cart-product-brand mb-2">Brand: {product.product_id.brand || 'N/A'}</p>

          <div className="cart-product-actions mb-2">
            <div className="quantity-selector me-3">
              <label htmlFor="quantity">Qty:</label>
              <select 
                name="quantity" 
                id="quantity" 
                value={product.quantity || 1}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5,6,7,8,9].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); handleDelete(); }} className="me-2">Delete</a>
            <a href="#" className="me-2">Save for later</a>
            <a href="#" className="me-2">See more like this</a>
            <a href="#">Share</a>
          </div>

          <p className="cart-product-description mb-0">Description: {product.product_id.description || 'No description available'}</p>
        </div>

        <div className="col-2 text-end">
          <div className="d-flex justify-content-end align-items-center mb-1">
            {product.product_id.discount_percentage > 0 && (
              <span className="badge bg-danger me-2">{product.product_id.discount_percentage}% off</span>
            )}
          </div>
          <p className="cart-product-price mb-0">${discountedPrice.toFixed(2)}</p>
          {product.product_id.discount_percentage > 0 && (
            <p className="text-muted mb-2">
              <small>M.R.P.: <del>${product.price.toFixed(2)}</del></small>
            </p>
          )}
          <p className="mb-0">Rating: {product.product_id.rating.toFixed(1)}/5</p>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;