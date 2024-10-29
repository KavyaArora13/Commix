import React from 'react';
import '../../Assets/Css/CheckOut/TotalSummary.scss';

const TotalSummary = ({ subtotal, shipping, total, vat, discount, onCheckout, isPaymentDisabled }) => {
  return (
    <div className="total-summary">
      <div className="summary-item">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="summary-item">
        <span>Shipping</span>
        <span>₹{shipping.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="summary-item discount">
          <span>Discount</span>
          <span>-₹{discount.toFixed(2)}</span>
        </div>
      )}
      <div className="summary-item">
        <span>VAT (5%)</span>
        <span>₹{vat.toFixed(2)}</span>
      </div>
      <div className="summary-item total">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
      <button 
        className="checkout-button" 
        onClick={onCheckout}
        disabled={isPaymentDisabled}
      >
        PROCEED TO PAYMENT
      </button>
    </div>
  );
};

export default TotalSummary;
