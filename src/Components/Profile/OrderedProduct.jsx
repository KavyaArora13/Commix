import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../Assets/Css/Profile/OrderedProduct.scss';
import ReturnRequestModal from './ReturnRequestModal';
import { API_URL } from '../../config/api';

const OrderedProduct = ({ 
  image, 
  title, 
  seller, 
  price, 
  originalPrice, 
  quantity, 
  slug, 
  productId,
  handleOpenReviewModal,
  order,
  onReturnSuccess,
  item,
  handleOpenReturnModal
}) => {
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReturnDetails, setShowReturnDetails] = useState(false);

  console.log('Order or status missing:', order);


  const openReturnModal = () => {
    handleOpenReturnModal(order, item);
  };

  const closeReturnModal = () => {
    setIsReturnModalOpen(false);
  };

  const handleReturnSubmit = async (returnData) => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        orderId: order._id,
        itemId: item._id,
        reason: returnData.reason,
        description: returnData.description,
        returnType: returnData.returnType
      };

      console.log('Sending return request:', payload);

      const response = await axios.post(`${API_URL}/orders/return-request`, payload);

      if (response.data.success) {
        toast.success('Return request submitted successfully');
        closeReturnModal();
        if (onReturnSuccess) {
          onReturnSuccess();
        }
      } else {
        toast.error(response.data.message || 'Failed to submit return request');
      }
    } catch (error) {
      console.error('Return request error:', error.response?.data || error);
      toast.error(
        error.response?.data?.message || 
        'Failed to submit return request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReturnEligible = () => {
    // Check if order exists and has a status
    if (!order || !order.order_status) {
      console.log('Order or status missing:', order);
      return false;
    }

    // Check if order is delivered
    const isDelivered = order.order_status.toLowerCase() === 'delivered';
    
    // If not delivered, return false
    if (!isDelivered) {
      console.log('Order not delivered yet');
      return false;
    }

    // Check if item has any return status
    if (item.return_status && item.return_status !== 'none') {
      console.log('Item has return status:', item.return_status);
      return false;
    }

    // For testing/development - return true for delivered orders with no return status
    return true;
  };

  const toggleReturnDetails = () => {
    setShowReturnDetails(!showReturnDetails);
  };

  const renderReturnStatus = () => {
    if (item.return_status === 'requested' && item.return_details) {
      return (
        <div className="return-status">
          <span 
            className="status-badge pending"
            onClick={toggleReturnDetails}
            style={{ cursor: 'pointer' }}
          >
            Return Request Pending
            {showReturnDetails && (
              <div className="return-details">
                <p>Type: {item.return_details.request_type}</p>
                <p>Reason: {item.return_details.reason}</p>
                <p>Date: {new Date(item.return_details.request_date).toLocaleDateString()}</p>
              </div>
            )}
          </span>
        </div>
      );
    }
    return null;
  };

  const renderReturnButton = () => {
    // First check if order and item exist
    if (!order || !item) {
      return null;
    }

    const orderStatus = order.order_status.toLowerCase();

    // Check for return status first
    if (item.return_status) {
      return renderReturnStatus();
    }

    // If no return status, show order status buttons
    switch (orderStatus) {
      case 'pending':
        return <span className="order-status pending">Order Processing</span>;
      
      case 'processing':
        return <span className="order-status processing">Order Confirmed</span>;
      
      case 'shipped':
        return <span className="order-status shipped">In Transit</span>;
      
      case 'delivered':
        if (isReturnEligible()) {
          return (
            <button 
              className="action-button" 
              onClick={openReturnModal}
            >
              Return or replace items
            </button>
          );
        }
        return <span className="return-not-eligible">Return window closed</span>;
      
      case 'cancelled':
        return <span className="order-status cancelled">Order Cancelled</span>;
      
      default:
        return (
          <span className="order-status">
            {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
          </span>
        );
    }
  };

  return (
    <div className="ordered-product">
      <div className="product-image-container">
        <img src={item.product.image || image} alt={item.product.name} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-title">{item.product.name || title}</h3>
        <p className="product-seller">Sold by: {item.product.seller || seller}</p>
        <p className="product-price">
          ₹{item.price || price}
          {originalPrice && <span className="original-price">₹{originalPrice}</span>}
        </p>
        <Link to={`/product/${item.product._id || slug}`} className="ask-question">
          Product question? Ask Seller
        </Link>
        <div className="product-actions">
          <button className="buy-again">Buy it Again</button>
          {renderReturnButton()}
          <button 
            className="action-button" 
            onClick={() => handleOpenReviewModal({ 
              id: item.product._id || productId, 
              name: item.product.name || title, 
              image: item.product.image || image, 
              price: item.price || price 
            })}
          >
            Write a product review
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderedProduct;
