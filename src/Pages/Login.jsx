import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authActions';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import '../Assets/Css/Login/Login.scss';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import GoogleLoginComponent from '../Components/GoogleLogin.jsx';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

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
          toast.error(error.message || 'Login failed. Please try again.'); // Display the error message
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      toast.error('Please enter your email address');
      return;
    }
    // Here you would typically call an API to handle the password reset
    console.log('Password reset requested for:', forgotPasswordEmail);
    toast.success('Password reset instructions sent to your email');
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
  };

  return (
    <div className="login-page">
      <Link to="/"> 
        <img src='Mask group.png' alt="COMIX" className="brand-logo" />
      </Link>
      <div className="login-container">
        <div className="login-form-container">
          {!showForgotPassword ? (
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
                <button type="submit" className="reset-password-btn">
                  Reset Password
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
