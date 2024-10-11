import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../../Assets/Css/Profile/PersonalInformation.scss';

const PersonalInformation = ({ user }) => {
  if (!user) {
    return <div className="no-user-info">No user information available</div>;
  }

  const address = user.address && user.address.length > 0 ? user.address[0] : null;

  return (
    <div className="personal-information">
      <h2 className="section-title">Personal Information</h2>
      <div className="info-card">
        <div className="info-item">
          <FaUser className="icon" />
          <div className="info-content">
            <span className="label">First Name</span>
            <span className="value">{user.first_name || 'Not provided'}</span>
          </div>
        </div>
        <div className="info-item">
          <FaUser className="icon" />
          <div className="info-content">
            <span className="label">Last Name</span>
            <span className="value">{user.last_name || 'Not provided'}</span>
          </div>
        </div>
        <div className="info-item">
          <FaEnvelope className="icon" />
          <div className="info-content">
            <span className="label">Email</span>
            <span className="value">{user.email}</span>
          </div>
        </div>
        <div className="info-item">
          <FaPhone className="icon" />
          <div className="info-content">
            <span className="label">Phone</span>
            <span className="value">{user.phone_number || 'Not provided'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;