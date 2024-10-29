import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';

export default function OrderContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <th>Username</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.order_no}</td>
                <td>{order.user && order.user.username ? order.user.username : 'N/A'}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{order.order_status}</td>
                <td>${order.total_amount.toFixed(2)}</td>
                <td>
                  <button onClick={() => downloadInvoice(order._id)}>
                    Download Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
