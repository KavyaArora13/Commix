import React, { useState, useEffect, useRef } from 'react';
import '../../Assets/Css/Profile/EditProfileModal.scss';
import profileBanner from '../../Assets/Image/main-image.png';
import Spinner from '../Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const EditProfileModal = ({ isOpen, onClose, onUpdate, user, error }) => {
  const [formData, setFormData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && user && !formData) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        profile_picture: user.profile_picture || null
      });
      setPreviewImage(user.profile_picture || null);
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      if (key === 'profile_picture' && formData[key] instanceof File) {
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
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
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
              <input 
                type="text" 
                name="first_name" 
                value={formData.first_name} 
                onChange={handleChange} 
                placeholder="First Name" 
              />
              <input 
                type="text" 
                name="last_name" 
                value={formData.last_name} 
                onChange={handleChange} 
                placeholder="Last Name" 
              />
            </div>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email address" 
              disabled
            />
            <div className="button-row">
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