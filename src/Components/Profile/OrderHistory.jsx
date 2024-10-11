import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderedProduct from './OrderedProduct';
import { API_URL } from '../../config/api';
import '../../Assets/Css/Profile/OrderHistory.scss';
import { FaShoppingBag } from 'react-icons/fa'; // Import the shopping bag icon

const OrderHistory = ({ userDetails }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5); // Set to 5 orders per page

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userDetails) {
        console.log("No user details available");
        setLoading(false);
        return;
      }

      let userId;
      if (typeof userDetails === 'object') {
        userId = userDetails.id || userDetails._id || 
                 (userDetails.user && (userDetails.user.id || userDetails.user._id));
      } else {
        userId = userDetails;
      }

      if (!userId) {
        console.log("Unable to find user ID in userDetails:", userDetails);
        setError('User ID not found in user details');
        setLoading(false);
        return;
      }

      console.log("Fetching orders for userId:", userId);

      try {
        const response = await axios.get(`${API_URL}/orders/history/${userId}`);
        console.log("API response:", response.data);
        
        if (response.data && response.data.success) {
          setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
        } else {
          console.error("Unexpected API response structure:", response.data);
          setError('Unexpected API response structure');
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        if (err.response && err.response.status === 404) {
          setOrders([]);
        } else {
          setError('An error occurred while fetching order history');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userDetails]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (orders.length === 0) {
    return (
      <div className="order-history empty-state">
        <h2>Order History</h2>
        <div className="empty-state-content">
          <FaShoppingBag className="empty-state-icon" />
          <p>You haven't placed any orders yet</p>
          <button className="primary-button">BROWSE PRODUCTS</button>
        </div>
      </div>
    );
  }

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="order-history">
      <h2>Order History</h2>
      {currentOrders.map(order => (
        <div key={order._id} className="order">
          <h3>Order No: {order.order_no}</h3>
          <p><strong>Status:</strong> {order.order_status}</p>
          <p><strong>Total Amount:</strong> Rs {order.total_amount.toFixed(2)}</p>
          <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <div className="order-items">
            {order.items.map(item => (
              <OrderedProduct 
                key={item._id}
                image={item.product?.image || "/images/order.png"}
                title={item.product?.name || "Product Name Not Available"}
                seller="Seller information not available"
                price={item.price?.toFixed(2) || "0.00"}
                originalPrice={item.product?.price ? item.product.price.toFixed(2) : null}
                quantity={item.quantity}
                slug={item.product?.slug || ""}
                productId={item.product?._id || ""}
              />
            ))}
          </div>
        </div>
      ))}
      {orders.length > ordersPerPage && (
        <Pagination
          itemsPerPage={ordersPerPage}
          totalItems={orders.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href='#!' className='page-link'>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default OrderHistory;