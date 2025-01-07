import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function OrderContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log(orders);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      console.log('Fetched orders:', response.data.orders); // Log the orders to check the structure
      setOrders(response.data.orders);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/orders/invoice/${orderId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Failed to download invoice:', err);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="card">
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order No</th>
              <th>Customer</th>
              <th>Date & Time</th>
              <th>Order Status</th>
              <th>Return Status</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              // Updated customer name logic for guest users
              const customerName = order.is_guest 
                ? `${order.guest_info?.firstName || ''} ${order.guest_info?.lastName || ''} (Guest)`
                : order.user?.username || 'N/A';

              // If guest name is just " (Guest)", show email instead
              const displayName = customerName.trim() === '(Guest)' 
                ? `${order.guest_info?.email} (Guest)` 
                : customerName;

              return (
                <tr key={order._id}>
                  <td>{order.order_no}</td>
                  <td>
                    <div>
                      {displayName}
                      {order.is_guest && (
                        <div className="guest-details">
                          <small>Email: {order.guest_info?.email}</small>
                          <small>Phone: {order.guest_info?.phone}</small>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <span className={`status ${order.order_status.toLowerCase()}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td>
                    {order.items && order.items.map((item, index) => (
                      <div key={index}>
                        {item.return_status === 'requested' && (
                          <span className="status return-requested">
                            Return Requested
                          </span>
                        )}
                        {item.return_status === 'approved' && (
                          <span className="status return-approved">
                            Return Approved
                          </span>
                        )}
                        {item.return_status === 'rejected' && (
                          <span className="status return-rejected">
                            Return Rejected
                          </span>
                        )}
                        {(!item.return_status || item.return_status === 'none') && (
                          <span className="status no-return">-</span>
                        )}
                      </div>
                    ))}
                  </td>
                  <td>₹{order.total_amount.toFixed(2)}</td>
                  <td>
                    <button 
                      className="download-btn"
                      onClick={() => downloadInvoice(order._id)}
                    >
                      Download Invoice
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
