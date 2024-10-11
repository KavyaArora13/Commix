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
import FavoriteOrders from '../Components/Profile/FavoriteOrders';
import DeleteAccount from '../Components/Profile/DeleteAccount';
import EditProfileModal from '../Components/Profile/EditProfileModal';
import Spinner from '../Components/Spinner';
import '../Assets/Css/Profile/Profile.scss';

const Profile = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user: userDetails, loading: userLoading, error: userError } = useSelector(state => state.user);
  const { isAuthenticated, loading: authLoading } = useSelector(state => state.auth);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('personal-info');

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser ? (storedUser.id || (storedUser.user && storedUser.user.id)) : null;
      if (userId) {
        dispatch(fetchUserDetails(userId));
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
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await dispatch(updateUserDetails(updatedData)).unwrap();
      if (response.success) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser ? (storedUser.id || (storedUser.user && storedUser.user.id)) : null;
        if (userId) {
          dispatch(fetchUserDetails(userId));
        }
        handleCloseEditModal();
      } else {
        console.error('Failed to update profile:', response.message);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (authLoading || userLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated && !authLoading) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'personal-info':
        return <PersonalInformation user={userDetails} />;
      case 'order-history':
        return <OrderHistory userDetails={userDetails} />;
      case 'my-addresses':
        return <MyAddresses userDetails={userDetails} />;
      case 'favorite-orders':
        return <FavoriteOrders userDetails={userDetails} />;
      case 'delete-account':
        return <DeleteAccount userDetails={userDetails} />;
      default:
        return <PersonalInformation user={userDetails} />;
    }
  };

  return (
    <div>
      <Header />
      {userError ? (
        <div>Error loading user data: {userError}</div>
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
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-3">
                <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
              </div>
              <div className="col-md-9">
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      )}
      <Footer />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={handleUpdateProfile}
        user={userDetails}
      />
    </div>
  );
};

export default Profile;