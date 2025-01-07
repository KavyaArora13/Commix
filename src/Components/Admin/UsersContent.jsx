import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { FaEdit, FaTrash, FaPlus, FaUpload, FaEye, FaBan, FaArrowLeft } from 'react-icons/fa';
import '../../Assets/Css/Admin/UserContent.scss';

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
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

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

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      newAddress: { street: '', house: '', postcode: '', location: '', country: '' }
    });
    setIsEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setEditingUser(null);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(editingUser).forEach(key => {
        if (key === 'address') {
          formData.append(key, JSON.stringify(editingUser[key]));
        } else if (key !== 'newAddress') {
          formData.append(key, editingUser[key]);
        }
      });
      if (newProfilePicture) {
        formData.append('profile_picture', newProfilePicture);
      }

      const response = await axios.put(`${API_URL}/admin/users/${editingUser._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setUsers(prevUsers => prevUsers.map(user => 
          user._id === editingUser._id ? response.data.user : user
        ));
        handleCloseEditForm();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
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

  return (
    <div className="user-content">
      <div className="user-header">
        <h2>Users</h2>
        {/* Add user button if needed */}
      </div>
      <p>Manage your user base here.</p>

      {isEditFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit User</h3>
            <form onSubmit={handleUpdateUser}>
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
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleEditInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={editingUser.phone_number}
                  onChange={handleEditInputChange}
                />
              </div>

              <div className="form-group">
                <label>Addresses</label>
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
                <button type="button" onClick={() => setIsAddingNewAddress(!isAddingNewAddress)} className="add-address-btn">
                  <FaPlus /> {isAddingNewAddress ? 'Cancel' : 'Add New Address'}
                </button>
              </div>

              {isAddingNewAddress && (
                <div className="new-address-form">
                  <h4>New Address</h4>
                  <div className="form-group">
                    <input
                      type="text"
                      name="newAddress.street"
                      value={editingUser.newAddress.street}
                      onChange={handleEditInputChange}
                      placeholder="Street"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="newAddress.house"
                      value={editingUser.newAddress.house}
                      onChange={handleEditInputChange}
                      placeholder="House"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="newAddress.postcode"
                      value={editingUser.newAddress.postcode}
                      onChange={handleEditInputChange}
                      placeholder="Postcode"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="newAddress.location"
                      value={editingUser.newAddress.location}
                      onChange={handleEditInputChange}
                      placeholder="Location"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="newAddress.country"
                      value={editingUser.newAddress.country}
                      onChange={handleEditInputChange}
                      placeholder="Country"
                    />
                  </div>
                  <button type="button" onClick={addNewAddress} className="add-address-btn">Add Address</button>
                </div>
              )}

              <div className="button-group">
                <button type="submit" className="submit-btn">Update User</button>
                <button type="button" onClick={handleCloseEditForm} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone_number}</td>
              <td>{user.isBlocked ? 'Blocked' : 'Active'}</td>
              <td>
                <button onClick={() => viewUser(user._id)} title="View">
                  <FaEye />
                </button>
                <button onClick={() => handleEditUser(user)} title="Edit">
                  <FaEdit />
                </button>
                <button onClick={() => blockUser(user._id, user.isBlocked)} title={user.isBlocked ? 'Unblock' : 'Block'}>
                  <FaBan />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
