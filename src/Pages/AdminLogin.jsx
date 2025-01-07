import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../features/auth/authActions'; // Import adminLogin
import { setAdmin } from '../features/auth/authSlice'; // Import setAdmin from authSlice
import '../Assets/Css/Admin/AdminLogin.scss'; // Import the CSS file for styling
import { toast } from 'sonner'; // Ensure you have this import

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      toast.error('Please fill in all fields');
    } else {
      try {
        const resultAction = await dispatch(adminLogin({ email, password }));
        if (adminLogin.fulfilled.match(resultAction)) {
          dispatch(setAdmin(resultAction.payload.admin)); // Dispatch setAdmin action
          navigate('/admin');
        } else {
          const error = resultAction.payload;
          toast.error(error.message || 'Login failed. Please try again.'); // Display the error message
        }
      } catch (err) {
        console.error('Login error:', err);
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="admin-login-container">
      <h2 className="admin-login-title">Admin Login</h2>
      <form onSubmit={handleSubmit} className="admin-login-form">
        <div className="admin-login-form-group">
          <label htmlFor="email" className="admin-login-label">Email:</label>
          <input
            type="email"
            id="email"
            className="admin-login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="admin-login-form-group">
          <label htmlFor="password" className="admin-login-label">Password:</label>
          <input
            type="password"
            id="password"
            className="admin-login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="admin-login-button">Login</button>
      </form>
    </div>
  );
}