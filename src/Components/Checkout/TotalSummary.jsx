import React from 'react';
import '../../Assets/Css/CheckOut/TotalSummary.scss';

const TotalSummary = ({ 
  subtotal, 
  shipping, 
  total, 
  vat, 
  discount, 
  onCheckout, 
  isPaymentDisabled,
  selectedPaymentMethod,
  isGuestUser,
  isProcessingPayment,
  appliedOffer
}) => {
  
  const getButtonText = () => {
    if (isProcessingPayment) {
      return (
        <div className="d-flex align-items-center justify-content-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Processing...</span>
          </div>
          Processing Payment...
        </div>
      );
    }
    if (isPaymentDisabled) {
      return 'Please Select Address';
    }
    if (selectedPaymentMethod === 'cod') {
      return 'PLACE ORDER';
    }
    return 'PROCEED TO PAYMENT';
  };

  return (
    <div className="total-summary">
      <div className="summary-item">
        <span>Original Price</span>
        <span>₹{Number(subtotal).toFixed(2)}</span>
      </div>
      
      {discount > 0 && (
        <div className="summary-item discount">
          <span>Discount ({appliedOffer?.discount_percentage}% off)</span>
          <span>-₹{Number(discount).toFixed(2)}</span>
        </div>
      )}
      
      <div className="summary-item">
        <span>Shipping</span>
        <span>₹{Number(shipping).toFixed(2)}</span>
      </div>
      
      <div className="summary-item">
        <span>VAT (5%)</span>
        <span>₹{Number(vat).toFixed(2)}</span>
      </div>
      
      <div className="summary-item total">
        <span>Total</span>
        <span>₹{Number(total).toFixed(2)}</span>
      </div>

      {isGuestUser && (
        <div className="guest-notice">
          <p>Checking out as Guest</p>
        </div>
      )}
      
      <button 
        className={`checkout-button ${isPaymentDisabled || isProcessingPayment ? 'disabled' : ''}`}
        onClick={onCheckout}
        disabled={isPaymentDisabled || isProcessingPayment}
        title={isPaymentDisabled ? 'Please select a delivery address to continue' : ''}
      >
        {getButtonText()}
      </button>

      {isGuestUser && (
        <div className="login-prompt">
          <p>Have an account? <a href="/login">Login</a> for a faster checkout</p>
        </div>
      )}
    </div>
  );
};

export default TotalSummary;
