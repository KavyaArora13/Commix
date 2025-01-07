import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaMapMarkerAlt, FaEdit, FaTrashAlt, FaPlus, FaPhone, FaUser, FaMapMarked } from 'react-icons/fa';
import AddressModal from './AddressModal';
import { 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    fetchUserDetails 
} from '../../features/user/userSlice';
import '../../Assets/Css/Profile/MyAddresses.scss';

const MyAddresses = () => {
  const dispatch = useDispatch();
  const { user: userDetails, isLoading: loading, error: reduxError } = useSelector(state => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [error, setError] = useState('');

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser?._id || storedUser?.id || (storedUser?.user && storedUser.user._id);
        if (userId) {
          await dispatch(fetchUserDetails(userId)).unwrap();
        }
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };
    fetchUser();
  }, [dispatch]);

  // Add this effect to update addresses when userDetails changes
  useEffect(() => {
    if (userDetails?.address) {
      localStorage.setItem('userAddresses', JSON.stringify(userDetails.address));
    }
  }, [userDetails]);

  const getErrorMessage = (error) => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return 'An error occurred';
  };

  const handleSaveAddress = async (newAddress) => {
    try {
      setError('');
      const addressData = {
        address_name: newAddress.address_name || 'Home',
        street: newAddress.street,
        state: newAddress.state || 'Default State',
        house: newAddress.house,
        postcode: newAddress.postcode,
        location: newAddress.location,
        country: newAddress.country,
        phone_number: newAddress.phone_number.replace(/\D/g, ''),
        firstName: newAddress.firstName,
        lastName: newAddress.lastName
      };

      if (addressToEdit) {
        await dispatch(updateAddress({ 
          addressId: addressToEdit._id, 
          addressData 
        })).unwrap();
      } else {
        await dispatch(addAddress(addressData)).unwrap();
      }

      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?._id || storedUser?.id || (storedUser?.user && storedUser.user._id);
      if (userId) {
        await dispatch(fetchUserDetails(userId)).unwrap();
      }
      setIsModalOpen(false);
      setAddressToEdit(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      setError('');
      await dispatch(deleteAddress(addressId)).unwrap();
      
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?._id || storedUser?.id || (storedUser?.user && storedUser.user._id);
      if (userId) {
        await dispatch(fetchUserDetails(userId)).unwrap();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleAddAddress = () => {
    setAddressToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setAddressToEdit(address);
    setIsModalOpen(true);
  };

  const renderAddressCard = (address) => (
    <div key={address._id} className="address-card">
      <div className="address-type-badge">
        {address.address_name || 'Home'}
      </div>
      <div className="address-header">
        <h3>
          <FaUser className="user-icon" />
          <span className="name">{address.firstName} {address.lastName}</span>
        </h3>
        <div className="address-actions">
          <FaEdit 
            className="icon-btn edit-btn" 
            aria-label="Edit address" 
            onClick={() => handleEditAddress(address)} 
          />
          <FaTrashAlt 
            className="icon-btn delete-btn" 
            aria-label="Delete address" 
            onClick={() => handleDeleteAddress(address._id)} 
          />
        </div>
      </div>
      <div className="address-content">
        <div className="address-line">
          <FaMapMarked />
          <span>{address.house}, {address.street}</span>
        </div>
        <div className="address-line">
          <FaMapMarkerAlt />
          <span>{address.location}, {address.state}</span>
        </div>
        <div className="address-line">
          <span className="postal">{address.postcode}, {address.country}</span>
        </div>
        <div className="address-line">
          <FaPhone />
          <span className="phone">{address.phone_number || 'Not provided'}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div>Loading addresses...</div>;
  }

  const addresses = userDetails?.address || [];

  return (
    <div className="my-addresses">
      <h2>My Addresses</h2>
      
      {error && <div className="error-message">{error}</div>}

      <button className="add-address-btn" onClick={handleAddAddress}>
        <FaPlus />
      </button>

      {loading ? (
        <div>Loading addresses...</div>
      ) : (
        <>
          {addresses.length === 0 ? (
            <div className="no-address">
              <p>You haven't added any address yet</p>
            </div>
          ) : (
            <div className="address-list">
              {addresses.map(renderAddressCard)}
            </div>
          )}
        </>
      )}
      
      <AddressModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAddressToEdit(null);
        }}
        onSave={handleSaveAddress}
        addressToEdit={addressToEdit}
      />
    </div>
  );
};

export default MyAddresses;