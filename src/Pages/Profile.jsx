// src/Pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchUserDetails, updateUserDetails, clearUserDetails } from '../features/user/userSlice';
import { checkAuthStatus } from '../features/auth/authActions';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ProfileBanner from '../Components/Profile/ProfileBanner';
import Sidebar from '../Components/Profile/Sidebar';
import PersonalInformation from '../Components/Profile/PersonalInformation';
import OrderHistory from '../Components/Profile/OrderHistory';
import MyAddresses from '../Components/Profile/MyAddresses';
import Favorites from '../Components/Profile/Favorites';
import DeleteAccount from '../Components/Profile/DeleteAccount';
import EditProfileModal from '../Components/Profile/EditProfileModal';
import Spinner from '../Components/Spinner';
import '../Assets/Css/Profile/Profile.scss';
import Touch from '../Components/Touch';

const Profile = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user: userDetails, loading: userLoading, error: userError } = useSelector(state => state.user);
  const { isAuthenticated, loading: authLoading } = useSelector(state => state.auth);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('personal-info');
  const [expandedSection, setExpandedSection] = useState(null);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log('Stored user:', storedUser);
      const userId = storedUser ? (storedUser.id || (storedUser.user && storedUser.user.id)) : null;
      console.log('User ID for fetching details:', userId);
      if (userId) {
        dispatch(fetchUserDetails(userId));
      } else {
        console.error('No user ID found for fetching user details');
      }
    } else if (!authLoading) {
      dispatch(clearUserDetails());
    }
  }, [isAuthenticated, authLoading, dispatch]);

  useEffect(() => {
    if (location.state && location.state.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location]);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setUpdateError('');
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      setUpdateError('');
      const result = await dispatch(updateUserDetails(updatedData)).unwrap();
      
      if (result && result.success) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser ? (storedUser.id || (storedUser.user && storedUser.user.id)) : null;
        
        if (userId) {
          await dispatch(fetchUserDetails(userId));
          handleCloseEditModal();
        }
      } else {
        setUpdateError(result?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setUpdateError(error?.message || 'An error occurred while updating profile');
    }
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
      setActiveSection(section);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'personal-info':
        return <PersonalInformation user={userDetails} />;
      case 'order-history':
        return <OrderHistory userDetails={userDetails} />;
      case 'my-addresses':
        return <MyAddresses userDetails={userDetails} />;
      case 'favorites':
        return <Favorites userDetails={userDetails} />;
      case 'delete-account':
        return <DeleteAccount userDetails={userDetails} />;
      default:
        return <PersonalInformation user={userDetails} />;
    }
  };

  const renderMobileContent = () => {
    const sections = [
      { key: 'personal-info', title: 'Personal Information' },
      { key: 'order-history', title: 'Order History' },
      { key: 'my-addresses', title: 'My Addresses' },
      { key: 'favorites', title: 'Favorites' },
      { key: 'delete-account', title: 'Delete Account' },
    ];

    return (
      <div className="mobile-accordion d-lg-none">
        {sections.map((section) => (
          <div key={section.key} className="accordion-item">
            <button
              className={`accordion-header ${expandedSection === section.key ? 'active' : ''}`}
              onClick={() => toggleSection(section.key)}
            >
              {section.title}
            </button>
            {expandedSection === section.key && (
              <div className="accordion-content">
                {renderContent()}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (authLoading || userLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated && !authLoading) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="profile-wrapper">
      <Header />
      {typeof userError === 'string' && userError ? (
        <div className="error-message">{userError}</div>
      ) : (
        <main className="profile-page">
          <ProfileBanner 
            name={userDetails?.first_name || userDetails?.name || 'User'}
            profilePicture={userDetails?.profile_picture}
            reviews={userDetails?.reviews_count || 0}
            photos={userDetails?.photos_count || 0}
            orders={userDetails?.orders_count || 0}
            onEditClick={handleOpenEditModal}
          />
          
          {updateError && (
            <div className="alert alert-danger mx-3 mt-3">
              {updateError}
            </div>
          )}

          <div className="container mt-4">
            <div className="row profile-content">
              <div className="col-lg-3 col-md-4 sidebar-wrapper d-none d-lg-block">
                <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
              </div>
              <div className="col-lg-9 col-md-8 content-wrapper">
                {renderMobileContent()}
                <div className="d-none d-lg-block">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
      <Touch/>
      <Footer />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateProfile}
        user={userDetails}
        error={updateError}
      />
    </div>
  );
};

export default Profile;