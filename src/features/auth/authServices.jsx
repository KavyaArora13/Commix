import api from '../../utils/api';

const validateToken = async (token) => {
  const response = await api.post('/auth/validate-token', { token });
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  // Ensure the response data has the correct structure
  return {
    user: response.data.user,
    accessToken: response.data.accessToken
  };
};

const logout = async () => {
  await api.post('/auth/logout');
};

const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

const googleLogin = async (token) => {
  const response = await api.post('/auth/google', { token });
  return response.data;
};

const verifyOtp = async (otpData) => {
  const response = await api.post('/auth/verify-otp', otpData);
  return response.data;
};

const resendOtp = async (email) => {
  const response = await api.post('/auth/resend-otp', { email });
  return response.data;
};

const refreshToken = async () => {
  const response = await api.post('/auth/refresh-token', {}, {
    withCredentials: true // Ensure cookies are sent with the request
  });
  return response.data;
};

const adminLogin = async (credentials) => {
  const response = await api.post('/admin/login', credentials); // Adjust the endpoint as needed
  return {
    admin: response.data.admin, // Adjust based on your response structure
    accessToken: response.data.accessToken,
  };
};

export const authService = {
  validateToken,
  login,
  logout,
  signup,
  googleLogin,
  verifyOtp,
  resendOtp,
  refreshToken,
  adminLogin,
};