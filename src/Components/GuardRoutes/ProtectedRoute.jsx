import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  console.log('ProtectedRoute - User:', user);
  
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Render child routes if not logged in
};

export default ProtectedRoute;