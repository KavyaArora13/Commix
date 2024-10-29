// src/Components/Profile/ProfileBanner.jsx
import React from 'react';
import '../../Assets/Css/Profile/ProfileBanner.scss';
import { FaUserCircle } from 'react-icons/fa';

const ProfileBanner = ({ name, profilePicture, onEditClick }) => {
  return (
    <div className="profile-banner">
      <div 
        className="banner-background"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/profile-banner.png)` }}
      ></div>
      <div className="container-fluid">
        <div className="row align-items-center h-100">
          <div className="col-md-6 d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-start">
            <div className="avatar-container mb-3 mb-md-0">
              {profilePicture ? (
                <img 
                  src={profilePicture}
                  alt={name}
                  className="avatar rounded-circle" 
                />
              ) : (
                <FaUserCircle className="avatar-icon" />
              )}
            </div>
            <h1 className="name text-center text-md-left ml-md-3">{name}</h1>
          </div>
          <div className="col-md-6 mt-3 mt-md-0">
            <div className="d-flex flex-column align-items-center align-items-md-end h-100 justify-content-between">
              <button className="edit-button btn" onClick={onEditClick}>EDIT PROFILE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;