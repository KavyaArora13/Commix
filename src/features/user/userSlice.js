import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
    user: null,
    isLoading: false,
    error: null,
};

export const fetchUserDetails = createAsyncThunk(
    'user/fetchUserDetails',
    async (userId, { rejectWithValue }) => {
        if (!userId) {
            console.error('fetchUserDetails called with no userId');
            return rejectWithValue('No userId provided');
        }
        try {
            console.log('Fetching user details for ID:', userId);
            const response = await api.get(`/users/${userId}`);
            console.log('User details response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching user details:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateUserDetails = createAsyncThunk(
    'user/updateDetails',
    async (userData, { rejectWithValue }) => {
      try {
        console.log('Sending update data to server:');
        for (let [key, value] of userData.entries()) {
          console.log(key, value);
        }
        const response = await api.put('/users/update', userData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error in updateUserDetails:', error);
        return rejectWithValue(error.response?.data || error.message);
      }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.user = action.payload;
        },
        clearUserDetails: (state) => {
            state.user = null;
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                console.log('fetchUserDetails.pending');
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                console.log('fetchUserDetails.fulfilled', action.payload);
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                console.error('fetchUserDetails.rejected', action.payload);
            })
            .addCase(updateUserDetails.pending, (state) => {
                console.log('updateUserDetails.pending');
                state.isLoading = true;
            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                console.log('updateUserDetails.fulfilled', action.payload);
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(updateUserDetails.rejected, (state, action) => {
                console.log('updateUserDetails.rejected', action.payload);
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setUserDetails,clearUserDetails } = userSlice.actions;
export default userSlice.reducer;