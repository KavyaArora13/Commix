import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authActions';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import '../Assets/Css/Login/Login.scss';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import GoogleLoginComponent from '../Components/GoogleLogin.jsx';
import axios from 'axios';
import { API_URL } from '../config/api';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateForm = () => {
    if (!email) {
      toast.error('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Email is invalid');
      return false;
    }

    if (!password) {
      toast.error('Password is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = { email, password };
      setLoading(true);
      try {
        const resultAction = await dispatch(login(userData));
        if (login.fulfilled.match(resultAction)) {
          toast.success('Login successful');
          navigate('/');
        } else {
          const error = resultAction.payload;
          toast.error(error.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setResetLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email: forgotPasswordEmail
      });
      
      toast.success(response.data.message || 'Password reset instructions sent to your email');
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset instructions');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!resetToken) {
      toast.error('Reset token is missing. Please request a new password reset.');
      return;
    }

    setResetLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        token: resetToken,
        newPassword: newPassword
      });
      
      if (response.data.success) {
        toast.success('Password reset successful');
        setShowResetForm(false);
        // Clear all reset-related states
        setNewPassword('');
        setConfirmPassword('');
        setResetToken('');
        // Redirect to login form
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
      
      // If token is invalid or expired, show the forgot password form
      if (errorMessage.includes('Invalid or expired')) {
        setShowResetForm(false);
        setShowForgotPassword(true);
        toast.error('Your reset link has expired. Please request a new one.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  // Modify the useEffect to handle the token
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      setResetToken(token);
      setShowResetForm(true);
      // Remove token from URL to prevent reuse
      window.history.replaceState({}, document.title, "/login");
    }
  }, []);

  return (
    <div className="login-page">
      <Link to="/"> 
        <img src='Mask group.png' alt="COMIX" className="brand-logo" />
      </Link>
      <div className="login-container">
        <div className="login-form-container">
          {showResetForm ? (
            // Reset Password Form
            <>
              <h2 className="reset-password-text">Reset Password</h2>
              <form className="reset-password-form" onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="new-password"
                      className="form-control"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="eye-icon" />
                      ) : (
                        <EyeIcon className="eye-icon" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirm-password"
                      className="form-control"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="reset-password-btn"
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
                <div className="back-to-login">
                  <Link to="/login">Back to Login</Link>
                </div>
              </form>
            </>
          ) : !showForgotPassword ? (
            // Existing Login Form
            <>
              <h2 className="welcome-text">Welcome Back</h2>
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="eye-icon" />
                      ) : (
                        <EyeIcon className="eye-icon" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="form-check-container">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="remember-me"
                    />
                    <label className="form-check-label" htmlFor="remember-me">
                      Remember me
                    </label>
                  </div>
                  <div className="forgot-password">
                    <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}>Forgot Password?</a>
                  </div>
                </div>
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
            </>
          ) : (
            // Forgot Password Form
            <>
              <h2 className="forgot-password-text">Forgot Password</h2>
              <p className="forgot-password-description">Enter your email address to reset your password.</p>
              <form className="forgot-password-form" onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label htmlFor="forgot-password-email">Email Address</label>
                  <input
                    type="email"
                    id="forgot-password-email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  className="reset-password-btn"
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
                <div className="back-to-login">
                  <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPassword(false); }}>Back to Login</a>
                </div>
              </form>
            </>
          )}

          {!showForgotPassword && (
            <>
              {/* OR Divider */}
              <div className="signup-divider">
                <span>OR</span>
              </div>

              {/* Google Sign-In Button */}
              <GoogleLoginComponent onLogin={() => navigate('/')} />

              <p className="mt-3 signup-link">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </>
          )}
        </div>
      </div>
      <div className="login-image-container">
        <img
          src="Commix_Character_website_GIF_Crop.gif"
          alt="Cartoon woman illustration"
          className="login-image"
        />
      </div>
    </div>
  );
};

export default Login;
