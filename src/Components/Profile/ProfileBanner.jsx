import React from 'react';
import '../../Assets/Css/Profile/ProfileBanner.scss';
import { FaUserCircle } from 'react-icons/fa'; // Import the user icon

const ProfileBanner = ({ name, profilePicture, onEditClick }) => {
  return (
    <div className="profile-banner">
      <div 
        className="banner-background"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/profile-banner.png)` }}
      ></div>
      <div className="container-fluid">
        <div className="row align-items-center h-100">
          <div className="col-md-6 d-flex align-items-center">
            <div className="avatar-container">
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
            <h1 className="name">{name}</h1>
          </div>
          <div className="col-md-6">
            <div className="d-flex flex-column align-items-end h-100 justify-content-between">
              <button className="edit-button btn" onClick={onEditClick}>EDIT PROFILE</button>
              {/* Removed user stats section */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;