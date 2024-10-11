import api from '../../utils/api';

const getUserDetails = async () => {
    console.log('Fetching user details from API');
    const response = await api.get('/users/me');
    console.log('API response:', response.data);
    return response.data;
};

const updateUser = async (userData) => {
    console.log('updateUser service called with:', userData);
    const formData = new FormData();
    
    Object.keys(userData).forEach(key => {
      if (key === 'address') {
        formData.append(key, JSON.stringify(userData[key]));
      } else if (key === 'profile_picture' && userData[key] instanceof File) {
        formData.append(key, userData[key]);
      } else {
        formData.append(key, userData[key]);
      }
    });
  
    console.log('FormData contents in updateUser service:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    try {
      const response = await api.put('/users/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('API response for update:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in updateUser service:', error);
      throw error;
    }
  };

export const userService = {
    getUserDetails,
    updateUser,
};