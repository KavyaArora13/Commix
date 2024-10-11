import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from './authServices';

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const user = await authService.validateToken(token);
        return { isAuthenticated: true, user };
      }
      return { isAuthenticated: false };
    } catch (error) {
      return rejectWithValue({ isAuthenticated: false, error: error.message });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      // Ensure the response has the same structure as Google sign-in
      return {
        user: response.user,
        accessToken: response.accessToken
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (token, { rejectWithValue }) => {
    try {
      const response = await authService.googleLogin(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(otpData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.resendOtp(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      return response;
    } catch (error) {
      // Check for specific error conditions
      if (error.response && error.response.status === 403) {
        return rejectWithValue({ message: 'Invalid credentials. Please log in again.' });
      }
      return rejectWithValue({ message: 'Failed to refresh token. Please try again.' });
    }
  }
);

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.adminLogin(credentials);
      return {
        admin: response.admin, // Adjust based on your response structure
        accessToken: response.accessToken,
      };
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: 'Login failed. Please try again.' });
    }
  }
);