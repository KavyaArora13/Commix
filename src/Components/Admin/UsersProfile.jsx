import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router

export default function UserProfile() {
  const { userId } = useParams(); // Get user ID from URL parameters
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]); // Changed from products to orders

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userResponse = await axios.get(`${API_URL}/admin/users/${userId}`);
        const ordersResponse = await axios.get(`${API_URL}/admin/users/${userId}/orders`); // Fetch user orders
        
        setUser(userResponse.data.user);
        setOrders(ordersResponse.data.orders); // Set orders instead of products
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="profile-info">
        <img src={user.profile_picture || 'default-profile.png'} alt="Profile" />
        <h3>{user.username}</h3>
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Address:</strong> {user.address.join(', ')}</p>
        <p><strong>Phone Number:</strong> {user.phone_number}</p>
      </div>
      <div className="user-stats">
        <div>Total Revenue: Rs {user.totalRevenue}</div>
        <div>Orders Count: {orders.length}</div> {/* Changed from Products Listed */}
      </div>
      <h3>User Orders</h3> {/* Changed from User Products to User Orders */}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Price</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.productName}</td> {/* Assuming order has productName */}
              <td>Rs {order.price}</td>
              <td>{order.date}</td>
              <td>
                <button onClick={() => softDeleteOrder(order.id)}>Soft Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function softDeleteOrder(orderId) {
    console.log(`Soft deleting order with ID: ${orderId}`);
    // Implement soft delete logic for orders
  }
}