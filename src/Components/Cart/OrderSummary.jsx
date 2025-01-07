import React from 'react';
import '../../Assets/Css/Cart/OrderSummary.scss';

const OrderSummary = ({ subtotal, itemCount, onProceedToBuy, cartItems }) => {
  const freeDeliveryThreshold = 1000;

  return (
    <div className="order-summary p-3">
      <div className="progress-container mb-2">
        <div className="progress-bar-wrapper">
          <div className="progress">
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{width: `${Math.min(subtotal / freeDeliveryThreshold * 100, 100)}%`}} 
              aria-valuenow={Math.min(subtotal, freeDeliveryThreshold)} 
              aria-valuemin="0" 
              aria-valuemax={freeDeliveryThreshold}
            ></div>
          </div>
        </div>
        <span className="progress-amount">${freeDeliveryThreshold}</span>
      </div>
      <div className="free-delivery mb-3">
        <span className="text-success">Your order is eligible for FREE Delivery</span>
        <p className="text-muted small">Choose FREE Delivery options at checkout.</p>
      </div>
      
      {/* Product List with Descriptions */}
      <div className="product-list mb-3">
        {cartItems && cartItems.map((item, index) => (
          <div key={index} className="product-item mb-2">
            <div className="product-name">{item.name}</div>
            <div className="product-description text-muted small">{item.description}</div>
            <div className="product-price">${item.price.toFixed(2)} x {item.quantity}</div>
          </div>
        ))}
      </div>

      <h5 className="mb-3">Subtotal ({itemCount} items): ${subtotal.toFixed(2)}</h5>
      <div className="form-check mb-3 gift-checkbox">
        <input className="form-check-input" type="checkbox" id="giftOrder" />
        <label className="form-check-label" htmlFor="giftOrder">
          This order contains a gift
        </label>
      </div>
      <button 
        className="btn btn-warning w-100 mb-3"
        onClick={onProceedToBuy}
      >
        Proceed to Buy
      </button>
    </div>
  );
};

export default OrderSummary;