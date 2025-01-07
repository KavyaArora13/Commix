import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAddress } from '../../features/user/userSlice';
import { toast } from 'react-toastify';
import '../../Assets/Css/CheckOut/PersonalInfoForm.scss';

const PersonalInfoForm = ({ onSubmit, isLoggedIn }) => {
  const dispatch = useDispatch();
  const [isAddressSubmitted, setIsAddressSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
    address_name: 'Home', // Default value for logged-in users
    street: '',
    state: '',
    house: '',
    postcode: '',
    location: '',
    country: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'firstName', 'lastName', 'street', 'house', 
      'postcode', 'location', 'country', 'phone_number', 'state'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} is required`;
      }
    });

    // Validate phone number
    const phoneNumber = formData.phone_number.replace(/\D/g, '');
    if (phoneNumber.length !== 10) {
      newErrors.phone_number = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const addressData = {
      ...formData,
      phone_number: formData.phone_number.replace(/\D/g, ''),
    };

    try {
      const userString = localStorage.getItem('user');
      
      if (isLoggedIn && userString) {
        // Logged in user - save to DB
        const userData = JSON.parse(userString);
        const userId = userData.user?.id || userData.id;
        
        if (userId) {
          const newAddress = await dispatch(addAddress(addressData)).unwrap();
          toast.success('Address saved successfully!');
          setIsAddressSubmitted(true);
          
          // Call the onSubmit function to update the parent component
          if (onSubmit) {
            onSubmit(newAddress); // Pass the new address to the parent
          }
        }
      } else {
        // Guest user - save to localStorage
        const guestAddresses = JSON.parse(localStorage.getItem('guestAddresses') || '[]');
        const newAddress = {
          ...addressData,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        
        const isDuplicate = guestAddresses.some(addr => 
          addr.street === newAddress.street && 
          addr.house === newAddress.house &&
          addr.postcode === newAddress.postcode
        );

        if (!isDuplicate) {
          guestAddresses.push(newAddress);
          localStorage.setItem('guestAddresses', JSON.stringify(guestAddresses));
          toast.success('Address saved successfully!');
          setIsAddressSubmitted(true);
          
          // Call the onSubmit function to update the parent component
          if (onSubmit) {
            onSubmit(newAddress); // Pass the new address to the parent
          }
          localStorage.removeItem('guestAddresses');
        } else {
          toast.warning('This address already exists!');
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.message || 'Failed to save address');
    }
  };

  return (
    <div className="personal-info-form ms-5">
      <form onSubmit={handleSaveAddress}>
        <input 
          type="text" 
          name="firstName"
          placeholder="First name*" 
          className={`form-input ${errors.firstName ? 'error' : ''}`}
          value={formData.firstName}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        
        <input 
          type="text" 
          name="lastName"
          placeholder="Last name*" 
          className={`form-input ${errors.lastName ? 'error' : ''}`}
          value={formData.lastName}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        
        <input 
          type="email" 
          name="email"
          placeholder="E-Mail" 
          className="form-input"
          value={formData.email}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        
        <div className="address-inputs">
          <input 
            type="text" 
            name="street"
            placeholder="Street*" 
            className={`form-input street ${errors.street ? 'error' : ''}`}
            value={formData.street}
            onChange={handleChange}
            disabled={isAddressSubmitted}
          />
          {errors.street && <span className="error-message">{errors.street}</span>}
          
          <input 
            type="text" 
            name="house"
            placeholder="House*" 
            className={`form-input houses ${errors.house ? 'error' : ''}`}
            value={formData.house}
            onChange={handleChange}
            disabled={isAddressSubmitted}
          />
          {errors.house && <span className="error-message">{errors.house}</span>}
        </div>
        
        <input 
          type="text" 
          name="postcode"
          placeholder="PostCode*" 
          className={`form-input postcode ${errors.postcode ? 'error' : ''}`}
          value={formData.postcode}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        {errors.postcode && <span className="error-message">{errors.postcode}</span>}
        
        <input 
          type="text" 
          name="location"
          placeholder="Location*" 
          className={`form-input location ${errors.location ? 'error' : ''}`}
          value={formData.location}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        {errors.location && <span className="error-message">{errors.location}</span>}
        
        <input 
          type="text" 
          name="state"
          placeholder="State*" 
          className={`form-input state ${errors.state ? 'error' : ''}`}
          value={formData.state}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        {errors.state && <span className="error-message">{errors.state}</span>}
        
        <select 
          name="country"
          className={`form-input ${errors.country ? 'error' : ''}`}
          value={formData.country}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        >
          <option value="">Select Country</option>
          <option value="India">India</option>
          <option value="Turkey">Turkey</option>
          <option value="USA">USA</option>
          <option value="England">England</option>
          <option value="France">France</option>
          <option value="Germany">Germany</option>
        </select>
        {errors.country && <span className="error-message">{errors.country}</span>}
        
        <input 
          type="tel" 
          name="phone_number"
          placeholder="Phone Number*" 
          className={`form-input ${errors.phone_number ? 'error' : ''}`}
          value={formData.phone_number}
          onChange={handleChange}
          disabled={isAddressSubmitted}
        />
        {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
        
        <p className="required-field-note">*Required field</p>
        
        {isAddressSubmitted ? (
          <div className="address-actions">
            <button 
              type="button" 
              className="address-submitted-btn" 
              disabled
            >
              ✓ Address Selected
            </button>
            <button 
              type="button"
              className="edit-address-btn"
              onClick={() => setIsAddressSubmitted(false)}
            >
              Edit Address
            </button>
          </div>
        ) : (
          <button type="submit" className="use-address-btn">
            Use This Address
          </button>
        )}
      </form>
    </div>
  );
};

export default PersonalInfoForm;