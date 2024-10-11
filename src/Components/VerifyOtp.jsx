import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { verifyOtp } from '../features/auth/authActions';
import { toast } from 'sonner'; // Import Sonner for notifications
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';

const VerifyOtp = ({ email }) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120); // 2 minutes timer
  const [isResending, setIsResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('OTP is required');
      return;
    }

    setLoading(true);
    const otpData = { email, otp };
    try {
      const resultAction = await dispatch(verifyOtp(otpData));
      if (verifyOtp.fulfilled.match(resultAction)) {
        toast.success('OTP verified successfully');
        navigate('/'); // Navigate to the home page
      } else if (verifyOtp.rejected.match(resultAction)) {
        const error = resultAction.payload;
        if (error && error.message) {
          toast.error(error.message);
        } else if (error && typeof error === 'string') {
          toast.error(error);
        } else {
          toast.error('OTP verification failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await axios.post(`${API_URL}/auth/resend-otp`, { email });
      toast.success('OTP resent successfully');
      setTimer(120); // Reset the timer to 2 minutes
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="verify-otp-container">
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            id="otp"
            className="form-control"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <p>Time remaining: {formatTime(timer)}</p>
        <button type="submit" className="verify-btn" disabled={loading}>
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            'Verify'
          )}
        </button>
      </form>
      <button
        className="btn btn-link mt-3"
        onClick={handleResendOtp}
        disabled={isResending || timer > 0}
      >
        {isResending ? 'Resending...' : 'Resend OTP'}
      </button>
    </div>
  );
};

export default VerifyOtp;