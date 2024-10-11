import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { FaEye, FaEdit, FaBan, FaArrowLeft, FaPlus, FaTrash, FaUpload } from 'react-icons/fa'; // Import icons
import '../../Assets/Css/Admin/UserProfile.scss'; // Import your CSS file for styling

export default function UsersContent() {
  const [users, setUsers] = useState([]); // State for users list
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [orders, setOrders] = useState([]); // State for user orders
  const [currentPage, setCurrentPage] = useState(1); // Current page for users
  const [ordersPage, setOrdersPage] = useState(1); // Current page for orders
  const usersPerPage = 10; // Number of users per page
  const ordersPerPage = 10; // Number of orders per page
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/users`);
        setUsers(response.data.users); // Set users from API response
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch user details and orders when a user is selected
  const viewUser = async (id) => {
    console.log(`Fetching user with ID: ${id}`); // Log the user ID
    const token = localStorage.getItem('accessToken'); // Get the token from local storage
    if (!token) {
      console.error('No access token found. User might not be logged in.');
      return; // Exit the function if no token is found
    }
    console.log(`Using token: ${token}`); // Log the token
    try {
      const userResponse = await axios.get(`${API_URL}/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      console.log("User response:", userResponse.data); // Log user response

      const ordersResponse = await axios.get(`${API_URL}/orders/history/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      console.log("Orders response:", ordersResponse.data); // Log orders response

      setSelectedUser(userResponse.data.user); // Set selected user data
      setOrders(ordersResponse.data.orders || []); // Set orders for the selected user
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn('No orders found for this user.'); // Log a warning instead of an error
        setOrders([]); // Set orders to an empty array
      } else {
        console.error('Error fetching user details:', error.response ? error.response.data : error);
      }
    }
  };

  // Reset selected user and orders when going back
  const handleBack = () => {
    setSelectedUser(null); // Reset selected user
    setOrders([]); // Clear orders
    setCurrentPage(1); // Reset to first page
    setOrdersPage(1); // Reset to first page
  };

  // Utility function to display default message for null values
  const displayValue = (value) => {
    return value ? value : 'Not provided';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Pagination logic for users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Pagination logic for orders
  const indexOfLastOrder = ordersPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page for users
  const paginateUsers = (pageNumber) => setCurrentPage(pageNumber);

  // Change page for orders
  const paginateOrders = (pageNumber) => setOrdersPage(pageNumber);

  const blockUser = async (id, currentBlockedStatus) => {
    try {
      const response = await axios.patch(`${API_URL}/admin/users/${id}/block`, {
        isBlocked: !currentBlockedStatus // Toggle the current status
      });
      
      if (response.data.success) {
        // Update the users list
        setUsers(prevUsers => prevUsers.map(user => 
          user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
        ));

        // If the blocked user is currently selected, update selectedUser
        if (selectedUser && selectedUser._id === id) {
          setSelectedUser(prevUser => ({ ...prevUser, isBlocked: !prevUser.isBlocked }));
        }

        console.log(response.data.message);
      } else {
        console.error('Failed to update user status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating user status:', error.response?.data?.message || error.message);
    }
  };

  const openEditModal = (user) => {
    setEditingUser({...user, newAddress: { street: '', house: '', postcode: '', location: '', country: '' }});
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setSelectedAddressIndex(0);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setEditingUser(prev => ({
        ...prev,
        address: prev.address.map((addr, index) => 
          index === selectedAddressIndex ? {...addr, [addressField]: value} : addr
        )
      }));
    } else if (name.startsWith('newAddress.')) {
      const addressField = name.split('.')[1];
      setEditingUser(prev => ({
        ...prev,
        newAddress: {...prev.newAddress, [addressField]: value}
      }));
    } else {
      setEditingUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const addNewAddress = () => {
    setEditingUser(prev => ({
      ...prev,
      address: [...prev.address, prev.newAddress],
      newAddress: { street: '', house: '', postcode: '', location: '', country: '' }
    }));
  };

  const removeAddress = (index) => {
    setEditingUser(prev => ({
      ...prev,
      address: prev.address.filter((_, i) => i !== index)
    }));
    if (selectedAddressIndex >= index) {
      setSelectedAddressIndex(Math.max(0, selectedAddressIndex - 1));
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePicture(file);
      setEditingUser(prev => ({
        ...prev,
        profile_picture: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editingUser).forEach(key => {
        if (key === 'address') {
          formData.append(key, JSON.stringify(editingUser[key]));
        } else {
          formData.append(key, editingUser[key]);
        }
      });
      if (newProfilePicture) {
        formData.append('profile_picture', newProfilePicture);
      }

      const response = await axios.put(`${API_URL}/admin/users/${editingUser._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setUsers(prevUsers => prevUsers.map(user => 
          user._id === editingUser._id ? response.data.user : user
        ));
        closeEditModal();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="card">
      {selectedUser ? (
        <div className="user-profile">
          {/* Back Button with Icon Only */}
          <button onClick={handleBack} style={backButtonStyle}>
            <FaArrowLeft style={{ fontSize: '24px', color: 'black' }} />
          </button>
          <div className="profile-header">
            <img src={selectedUser.profile_picture || 'default-profile.png'} alt="Profile" className="profile-image" />
            <div className="profile-details">
              <h3>{displayValue(selectedUser.username)}</h3>
              <p><strong>Email:</strong> {displayValue(selectedUser.email)}</p>
              <p><strong>Address:</strong> {selectedUser.address && selectedUser.address.length > 0 ? selectedUser.address.map(addr => `${addr.street}, ${addr.house}, ${addr.postcode}, ${addr.location}, ${addr.country}`).join(' | ') : 'Not provided'}</p>
              <p><strong>Phone Number:</strong> {displayValue(selectedUser.phone_number)}</p>
            </div>
            <div className="user-stats">
              <div><strong>Total Orders:</strong> {orders.length}</div>
            </div>
          </div>
          <h3>Ordered Products</h3>
          {orders.length === 0 ? (
            <p>No orders found for this user.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order No</th>
                  <th>Order Status</th>
                  <th>Total Amount</th>
                  <th>Items</th>
                  <th>Order Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order.order_no}</td>
                    <td>{order.order_status}</td>
                    <td>Rs {order.total_amount.toFixed(2)}</td>
                    <td>
                      <ul className="order-items">
                        {order.items.map(item => {
                          console.log('Item data:', item); // Debugging log
                          return (
                            <li key={item._id} className="ordered-product">
                              <img 
                                src={item.product.image || "/images/order.png"}
                                alt={item.product.name || "Product Image"}
                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                              />
                              <div className="product-details">
                                <strong className="product-name">{item.product.name || "Product Name Not Available"}</strong>
                                <p>Qty: {item.quantity}, Price: Rs {item.price.toFixed(2)}</p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Pagination for Orders */}
          {orders.length > ordersPerPage && (
            <div className="pagination-container">
              {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, index) => (
                <button 
                  key={index + 1} 
                  onClick={() => paginateOrders(index + 1)} 
                  className="pagination-button"
                >
                  {index + 1}
                </button>
              ))} 
            </div>
          )}
        </div>
      ) : (
        // If no user is selected, show the list of users
        <>
          <h2>Users</h2>
          <p>Manage your user base here.</p>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_number}</td>
                  <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                  <td>
                    <button onClick={() => viewUser(user._id)} style={buttonStyle}>
                      <FaEye style={iconStyle} /> View User
                    </button>
                    <button onClick={() => editUser(user._id)} style={buttonStyle}>
                      <FaEdit style={iconStyle} /> Edit
                    </button>
                    <button onClick={() => blockUser(user._id, user.isBlocked)} style={buttonStyle}>
                      <FaBan style={iconStyle} /> {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination for Users */}
          {users.length > usersPerPage && (
            <div className="pagination-container">
              {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
                <button 
                  key={index + 1} 
                  onClick={() => paginateUsers(index + 1)} 
                  className="pagination-button"
                >
                  {index + 1}
                </button>
              ))} 
            </div>
          )}
        </>
      )}
      {isEditModalOpen && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit User</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="form-group">
                <label>Profile Picture</label>
                <div className="profile-picture-container">
                  <img 
                    src={editingUser.profile_picture || '/default-profile.png'} 
                    alt="Profile" 
                    className="profile-picture-preview"
                  />
                  <label htmlFor="profile-picture-upload" className="upload-button">
                    <FaUpload /> Upload New Picture
                  </label>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editingUser.username}
                  onChange={handleEditInputChange}
                  placeholder="Username"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleEditInputChange}
                  placeholder="Email"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={editingUser.first_name}
                    onChange={handleEditInputChange}
                    placeholder="First Name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={editingUser.last_name}
                    onChange={handleEditInputChange}
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={editingUser.phone_number}
                  onChange={handleEditInputChange}
                  placeholder="Phone Number"
                />
              </div>
              
              <h3>Addresses</h3>
              <div className="address-list">
                {editingUser.address.map((addr, index) => (
                  <div key={index} className="address-item">
                    <input
                      type="radio"
                      id={`address-${index}`}
                      name="selectedAddress"
                      checked={selectedAddressIndex === index}
                      onChange={() => setSelectedAddressIndex(index)}
                    />
                    <label htmlFor={`address-${index}`}>Address {index + 1}</label>
                    <button type="button" onClick={() => removeAddress(index)} className="remove-address">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
              
              {selectedAddressIndex !== -1 && (
                <div className="address-form">
                  <div className="form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      name="address.street"
                      value={editingUser.address[selectedAddressIndex].street}
                      onChange={handleEditInputChange}
                      placeholder="Street"
                    />
                  </div>
                  <div className="form-group">
                    <label>House</label>
                    <input
                      type="text"
                      name="address.house"
                      value={editingUser.address[selectedAddressIndex].house}
                      onChange={handleEditInputChange}
                      placeholder="House"
                    />
                  </div>
                  <div className="form-group">
                    <label>Postcode</label>
                    <input
                      type="text"
                      name="address.postcode"
                      value={editingUser.address[selectedAddressIndex].postcode}
                      onChange={handleEditInputChange}
                      placeholder="Postcode"
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="address.location"
                      value={editingUser.address[selectedAddressIndex].location}
                      onChange={handleEditInputChange}
                      placeholder="Location"
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="address.country"
                      value={editingUser.address[selectedAddressIndex].country}
                      onChange={handleEditInputChange}
                      placeholder="Country"
                    />
                  </div>
                </div>
              )}
              
              <button type="button" onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}>
                <FaPlus /> {isAddingNewAddress ? 'Cancel' : 'Add New Address'}
              </button>
              
              {isAddingNewAddress && (
                <div className="new-address-form">
                  <h4>Add New Address</h4>
                  <div className="form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      name="newAddress.street"
                      value={editingUser.newAddress.street}
                      onChange={handleEditInputChange}
                      placeholder="Street"
                    />
                  </div>
                  <div className="form-group">
                    <label>House</label>
                    <input
                      type="text"
                      name="newAddress.house"
                      value={editingUser.newAddress.house}
                      onChange={handleEditInputChange}
                      placeholder="House"
                    />
                  </div>
                  <div className="form-group">
                    <label>Postcode</label>
                    <input
                      type="text"
                      name="newAddress.postcode"
                      value={editingUser.newAddress.postcode}
                      onChange={handleEditInputChange}
                      placeholder="Postcode"
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="newAddress.location"
                      value={editingUser.newAddress.location}
                      onChange={handleEditInputChange}
                      placeholder="Location"
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="newAddress.country"
                      value={editingUser.newAddress.country}
                      onChange={handleEditInputChange}
                      placeholder="Country"
                    />
                  </div>
                  <button type="button" onClick={addNewAddress}>Add Address</button>
                </div>
              )}
              
              <button type="submit">Save Changes</button>
              <button type="button" onClick={closeEditModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function editUser(id) {
    const user = users.find(u => u._id === id);
    if (user) {
      openEditModal(user);
    }
  }
}

// Styles for buttons and icons
const buttonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  margin: '0 5px',
  padding: '5px 10px',
};

const iconStyle = {
  marginRight: '5px',
};

// Style for the back button
const backButtonStyle = {
  marginBottom: '20px', // Space below the button
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};