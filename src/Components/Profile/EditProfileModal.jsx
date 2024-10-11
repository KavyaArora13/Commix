import React, { useState, useEffect, useRef } from 'react';
import '../../Assets/Css/Profile/EditProfileModal.scss';
import profileBanner from '../../Assets/Image/main-image.png';
import Spinner from '../Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const EditProfileModal = ({ isOpen, onClose, onUpdate, user }) => {
  const [formData, setFormData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && user && !formData) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || '',
        email: user.email || '',
        address: user.address && user.address.length > 0 ? user.address[0] : {
          street: '',
          house: '',
          postcode: '',
          location: '',
          country: ''
        },
        profile_picture: user.profile_picture || null
      });
      setPreviewImage(user.profile_picture || null);
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profile_picture: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const data = new FormData();
    for (const key in formData) {
      if (key === 'address') {
        data.append('address', JSON.stringify(formData.address));
      } else if (key === 'profile_picture' && formData[key] instanceof File) {
        data.append('profile_picture', formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      await onUpdate(data);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setFormData(null);
    onClose();
  };

  const renderProfileImage = () => {
    if (previewImage || (formData && formData.profile_picture)) {
      return <img src={previewImage || formData.profile_picture} alt="Profile" className="profile-image" />;
    } else {
      return <FontAwesomeIcon icon={faUser} className="default-profile-icon" />;
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="edit-profile-modal">
      <div className="modal-content">
        {isUpdating && <Spinner />}
        <div className="modal-header">
          <div className="background-image" style={{backgroundImage: `url(${profileBanner})`}}></div>
          <div className="profile-image-container" onClick={handleImageClick}>
            {renderProfileImage()}
            <div className="image-overlay">
              <span>Change Image</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange} 
              accept="image/*" 
              style={{ display: 'none' }}
            />
          </div>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" />
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" />
            </div>
            <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone number" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" />
            <textarea name="address.street" value={formData.address.street} onChange={handleChange} placeholder="Street Address"></textarea>
            <div className="form-row">
              <input type="text" name="address.house" value={formData.address.house} onChange={handleChange} placeholder="House No." />
              <input type="text" name="address.postcode" value={formData.address.postcode} onChange={handleChange} placeholder="Pincode" />
            </div>
            <div className="form-row">
              <input type="text" name="address.country" value={formData.address.country} onChange={handleChange} placeholder="Country" />
              <input type="text" name="address.location" value={formData.address.location} onChange={handleChange} placeholder="City" />
            </div>
            <div className="button-row">
              <button type="button" className="cancel-button" onClick={handleClose} disabled={isUpdating}>Cancel</button>
              <button type="submit" className="update-button" disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;