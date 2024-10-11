import React from 'react';
import '../../Assets/Css/Profile/MyAddresses.scss';
import { FaMapMarkerAlt, FaEdit, FaTrashAlt } from 'react-icons/fa';

const MyAddresses = ({ userDetails }) => {
  if (!userDetails) return <div>No user data available</div>;
  
  const addresses = userDetails.address || [];

  return (
    <div className="my-addresses">
      <h2>My Addresses</h2>
      {addresses.length === 0 ? (
        <div className="no-address">
          <div className="icon-container">
            <FaMapMarkerAlt className="map-icon" />
          </div>
          <p>You haven't added any address yet</p>
          <button className="add-address-btn">ADD ADDRESS</button>
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
                <FaEdit className="icon-btn edit-btn" aria-label="Edit address" />
                <FaTrashAlt className="icon-btn delete-btn" aria-label="Delete address" />
              </div>
            </div>
          ))}
          <button className="add-address-btn">Add New Address</button>
        </div>
      )}
    </div>
  );
};

export default MyAddresses;