import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const adminString = localStorage.getItem('admin');
  const ADMIN_ID = "66ebc63352734ee0a4c73bf8"; 

  console.log(adminString);
  console.log(ADMIN_ID);

  if (!adminString) {
    // Redirect to admin login if there's no admin in localStorage
    return <Navigate to="/adminlogin" replace />;
  }

  try {
    const admin = JSON.parse(adminString);
    if (admin && admin.id === ADMIN_ID) {
      // If the admin ID matches, render the child routes
      return <Outlet />;
    } else {
      // If the ID doesn't match, redirect to admin login
      return <Navigate to="/adminlogin" replace />;
    }
  } catch (error) {
    console.error("Error parsing admin data:", error);
    // If there's an error parsing the admin data, redirect to admin login
    return <Navigate to="/adminlogin" replace />;
  }
};

export default AdminRoute;
