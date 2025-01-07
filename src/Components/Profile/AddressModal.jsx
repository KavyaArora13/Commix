import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../../Assets/Css/Profile/AddressNodal.scss';

const AddressModal = ({ isOpen, onClose, onSave, addressToEdit }) => {
  const initialState = {
    address_name: 'Home',
    street: '',
    state: '',
    house: '',
    postcode: '',
    location: '',
    country: '',
    phone_number: '',
    firstName: '',
    lastName: ''
  };

  const [address, setAddress] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (addressToEdit) {
      // Ensure all fields are present when editing
      setAddress({
        ...initialState,
        ...addressToEdit,
        address_name: addressToEdit.address_name || 'Home',
        firstName: addressToEdit.firstName || '',
        lastName: addressToEdit.lastName || ''
      });
    } else {
      setAddress(initialState);
    }
  }, [addressToEdit, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'street', 'state', 'house', 'postcode', 
      'location', 'country', 'phone_number',
      'firstName', 'lastName'
    ];

    requiredFields.forEach(field => {
      if (!address[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} is required`;
      }
    });

    // Validate phone number format
    const phoneNumber = address.phone_number.replace(/\D/g, '');
    if (phoneNumber.length !== 10) {
      newErrors.phone_number = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const addressData = {
        ...address,
        phone_number: address.phone_number.replace(/\D/g, ''),
        address_name: address.address_name || 'Home'
      };
      
      await onSave(addressData);
      onClose();
    } catch (error) {
      console.error('Error saving address:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Error saving address. Please try again.'
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="address-modal-overlay">
      <div className="address-modal">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>{addressToEdit ? 'Edit Address' : 'Add New Address'}</h2>
        
        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <select
              name="address_name"
              value={address.address_name || 'Home'}
              onChange={handleChange}
              className="full-width"
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <input
                type="text"
                name="firstName"
                value={address.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            
            <div className="form-group half-width">
              <input
                type="text"
                name="lastName"
                value={address.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
              placeholder="Street"
              className={errors.street ? 'error' : ''}
            />
            {errors.street && <span className="error-message">{errors.street}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="house"
              value={address.house}
              onChange={handleChange}
              placeholder="House No."
              className={errors.house ? 'error' : ''}
            />
            {errors.house && <span className="error-message">{errors.house}</span>}
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <input
                type="text"
                name="location"
                value={address.location}
                onChange={handleChange}
                placeholder="City"
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
            
            <div className="form-group half-width">
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                placeholder="State"
                className={errors.state ? 'error' : ''}
              />
              {errors.state && <span className="error-message">{errors.state}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <input
                type="text"
                name="postcode"
                value={address.postcode}
                onChange={handleChange}
                placeholder="Postcode"
                className={errors.postcode ? 'error' : ''}
              />
              {errors.postcode && <span className="error-message">{errors.postcode}</span>}
            </div>
            
            <div className="form-group half-width">
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleChange}
                placeholder="Country"
                className={errors.country ? 'error' : ''}
              />
              {errors.country && <span className="error-message">{errors.country}</span>}
            </div>
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone_number"
              value={address.phone_number}
              onChange={handleChange}
              placeholder="Phone Number (10 digits)"
              className={errors.phone_number ? 'error' : ''}
            />
            {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
          </div>

          <button type="submit" className="save-btn">
            {addressToEdit ? 'Update Address' : 'Add Address'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;