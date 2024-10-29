// src/Components/Profile/MyAddresses.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../Assets/Css/Profile/MyAddresses.scss';
import { FaMapMarkerAlt, FaEdit, FaTrashAlt } from 'react-icons/fa';
import AddressModal from './AddressModal';
import { API_URL } from '../../config/api';

const MyAddresses = () => {
  const { user: userDetails } = useSelector(state => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [addresses, setAddresses] = useState(userDetails?.address || []);

  if (!userDetails) return <div>No user data available</div>;

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const handleAddAddress = () => {
    setAddressToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setAddressToEdit(address);
    setIsModalOpen(true);
  };

  const handleSaveAddress = async (newAddress) => {
    try {
      if (addressToEdit) {
        // Update existing address
        const response = await axios.put(
          `${API_URL}/users/address/${addressToEdit._id}`,
          newAddress,
          getAuthHeaders()
        );
        const updatedAddress = response.data.address;
        setAddresses(addresses.map(addr => addr._id === updatedAddress._id ? updatedAddress : addr));
      } else {
        // Add new address
        const response = await axios.post(
          `${API_URL}/users/address`,
          newAddress,
          getAuthHeaders()
        );
        const addedAddress = response.data.address;
        setAddresses([...addresses, addedAddress]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving address:', error);
      if (error.response && error.response.status === 401) {
        // Handle unauthorized error (e.g., redirect to login)
        console.log('Unauthorized. Redirecting to login...');
        // Implement your redirect logic here
      }
      // Handle other errors (e.g., show error message to user)
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(
        `${API_URL}/users/address/${addressId}`,
        getAuthHeaders()
      );
      setAddresses(addresses.filter(addr => addr._id !== addressId));
    } catch (error) {
      console.error('Error deleting address:', error);
      if (error.response && error.response.status === 401) {
        // Handle unauthorized error
        console.log('Unauthorized. Redirecting to login...');
        // Implement your redirect logic here
      }
      // Handle other errors
    }
  };

  return (
    <div className="my-addresses">
      <h2>My Addresses</h2>
      {addresses.length === 0 ? (
        <div className="no-address">
          <div className="icon-container">
            <FaMapMarkerAlt className="map-icon" />
          </div>
          <p>You haven't added any address yet</p>
          <button className="add-address-btn" onClick={handleAddAddress}>ADD ADDRESS</button>
        </div>
      ) : (
        <div className="address-list">
          {addresses.map((address, index) => (
            <div key={address._id} className="address-card">
              <h3>Address {index + 1}</h3>
              <p>{userDetails.name}</p>
              <p>{address.street}, {address.house}</p>
              <p>{address.location}, {address.postcode}</p>
              <p>{address.country}</p>
              <p>Phone: {userDetails.phone_number || 'Not provided'}</p>
              <div className="address-actions">
                <FaEdit className="icon-btn edit-btn" aria-label="Edit address" onClick={() => handleEditAddress(address)} />
                <FaTrashAlt className="icon-btn delete-btn" aria-label="Delete address" onClick={() => handleDeleteAddress(address._id)} />
              </div>
            </div>
          ))}
          <button className="add-address-btn" onClick={handleAddAddress}>Add New Address</button>
        </div>
      )}
      <AddressModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAddress}
        addressToEdit={addressToEdit}
      />
    </div>
  );
};

export default MyAddresses;