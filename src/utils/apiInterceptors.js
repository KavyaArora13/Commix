import api from './api';
import { getStore } from '../app/storeInstance';
import { logout } from '../features/auth/authActions';
import { updateAccessToken } from '../features/auth/authSlice';
import { authService } from '../features/auth/authServices';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

export const setupInterceptors = () => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({resolve, reject});
          }).then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          }).catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { accessToken, user } = await authService.refreshToken();

          if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            getStore().dispatch(updateAccessToken(accessToken));
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

            if (user) {
              localStorage.setItem('user', JSON.stringify(user));
            }

            processQueue(null, accessToken);
            return api(originalRequest);
          } else {
            throw new Error('No access token received');
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          getStore().dispatch(logout());
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};