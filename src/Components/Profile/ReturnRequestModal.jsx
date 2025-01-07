import React, { useState, useEffect, useRef } from 'react';
import '../../Assets/Css/Profile/ReturnRequestModal.scss';
import { toast } from 'react-toastify';

const ReturnRequestModal = ({ isOpen, onClose, order, item, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [returnType, setReturnType] = useState('return');
  const modalRef = useRef(null);

  // Handle modal focus
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setDescription('');
      setReturnType('return');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason || !description) {
      toast.error('Please fill in all required fields');
      return;
    }
    await onSubmit({
      orderId: order._id,
      itemId: item._id,
      reason,
      description,
      returnType
    });
    onClose(); // Close modal after submission
  };

  return (
    <div 
      className="return-request-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      tabIndex="-1"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="modal-title">{returnType === 'return' ? 'Return Request' : 'Replace Request'}</h3>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="product-info">
            <img 
              src={item.product?.image || "/images/order.png"} 
              alt={item.product?.name} 
              className="product-image"
            />
            <div className="product-details">
              <h4>{item.product?.name}</h4>
              <p>Order #: {order.order_no}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Request Type</label>
              <div className="return-type-options">
                <label>
                  <input
                    type="radio"
                    value="return"
                    checked={returnType === 'return'}
                    onChange={(e) => setReturnType(e.target.value)}
                  />
                  Return
                </label>
                <label>
                  <input
                    type="radio"
                    value="replace"
                    checked={returnType === 'replace'}
                    onChange={(e) => setReturnType(e.target.value)}
                  />
                  Replace
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Reason for {returnType}</label>
              <select 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                <option value="damaged">Product Damaged</option>
                <option value="wrong_item">Wrong Item Received</option>
                <option value="not_as_described">Product Not As Described</option>
                <option value="defective">Product Defective</option>
                <option value="size_issue">Size/Fit Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Additional Details</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Please provide more details about your return/replace request"
                rows="4"
              />
            </div>
            <div className="button-group">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-button">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestModal; 