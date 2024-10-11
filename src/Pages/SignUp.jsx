import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '../features/auth/authActions';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import '../Assets/Css/Login/Login.scss';
import GoogleLogin from '../Components/GoogleLogin.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Import Sonner for notifications
import VerifyOtp from '../Components/VerifyOtp.jsx'; // Import VerifyOtp component

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!username) {
      toast.error('Name is required');
      return false;
    }

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
    } else if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (!termsAccepted) {
      toast.error('You must accept the terms and policy');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = { username, email, password };
      setLoading(true);
      try {
        const resultAction = await dispatch(signup(userData));
        if (signup.fulfilled.match(resultAction)) {
          setShowOtpForm(true); // Show OTP form on successful signup
        } else if (signup.rejected.match(resultAction)) {
          const error = resultAction.payload;
          if (error && error.message) {
            toast.error(error.message);
          } else if (error && typeof error === 'string') {
            toast.error(error);
          } else {
            toast.error('Signup failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Signup error:', error);
        toast.error('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-page">
            <Link to="/"> 
      <img src='Mask group.png' alt="COMIX" className="brand-logo" />
      </Link>
      <div className="login-container">
        <div className="login-form-container">
          <h2 className="welcome-text">Sign-up to Commix</h2>
          {showOtpForm ? (
            <VerifyOtp email={email} />
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Name</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
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
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="terms"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                />
                <label className="forgot-password" htmlFor="terms">
                  I agree to the <a href="#">terms & policy</a>
                </label>
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  'Sign up'
                )}
              </button>
            </form>
          )}
       

          {/* Google Sign-In Button */}
          <div className="signup-divider">
            <span>OR</span>
          </div>

          {/* Google Sign-In Button */}
          <GoogleLogin onLogin={() => navigate('/')} />

          <p className="mt-3  signup-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
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
}