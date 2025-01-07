import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
    user: null,
    isLoading: false,
    error: null,
};

// Async Thunks
const fetchUserDetails = createAsyncThunk(
    'user/fetchUserDetails',
    async (userId, { rejectWithValue }) => {
        if (!userId) {
            return rejectWithValue('No userId provided');
        }
        try {
            const response = await api.get(`/users/${userId}`);
            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.response?.data?.error || 
                'Failed to fetch user details'
            );
        }
    }
);

const addAddress = createAsyncThunk(
    'user/addAddress',
    async (addressData, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.post('/users/address', addressData);
            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.response?.data?.error || 
                'Failed to add address'
            );
        }
    }
);

const updateAddress = createAsyncThunk(
    'user/updateAddress',
    async ({ addressId, addressData }, { dispatch, rejectWithValue, getState }) => {
        try {
            const response = await api.put(`/users/address/${addressId}`, addressData);
            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }
            const userId = getState().user.user.id;
            if (userId) {
                await dispatch(fetchUserDetails(userId));
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.response?.data?.error || 
                'Failed to update address'
            );
        }
    }
);

const deleteAddress = createAsyncThunk(
    'user/deleteAddress',
    async (addressId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/users/address/${addressId}`);
            if (!response.data.success) {
                return rejectWithValue(response.data.message);
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.response?.data?.error || 
                'Failed to delete address'
            );
        }
    }
);

const updateUserDetails = createAsyncThunk(
    'user/updateUserDetails',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.put(`/users/update`, userData);
            return response.data;
        } catch (error) {
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
            if (state.user && Array.isArray(state.user.address)) {
                localStorage.setItem('userAddresses', JSON.stringify(state.user.address));
            }
        },
        updateAddresses: (state, action) => {
            if (state.user) {
                const addresses = Array.isArray(action.payload) ? action.payload : [];
                state.user.address = addresses;
                localStorage.setItem('userAddresses', JSON.stringify(addresses));
            }
        },
        clearUserDetails: (state) => {
            state.user = null;
            state.isLoading = false;
            state.error = null;
            localStorage.removeItem('userAddresses');
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch user details
            .addCase(fetchUserDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Add address
            .addCase(addAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.user) {
                    state.user = action.payload.user;
                }
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Update address
            .addCase(updateAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.user) {
                    state.user = action.payload.user;
                }
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Delete address
            .addCase(deleteAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                if (action.payload.user) {
                    state.user = action.payload.user;
                    localStorage.setItem('user', JSON.stringify(action.payload.user));
                    if (Array.isArray(action.payload.user.address)) {
                        localStorage.setItem('userAddresses', JSON.stringify(action.payload.user.address));
                    }
                }
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Update user details
            .addCase(updateUserDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUserDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.error = null;
                if (state.user && Array.isArray(state.user.address)) {
                    localStorage.setItem('userAddresses', JSON.stringify(state.user.address));
                }
            })
            .addCase(updateUserDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

// Extract actions
const { setUserDetails, clearUserDetails, updateAddresses } = userSlice.actions;

// Single export statement for all items
export {
    // Slice actions
    setUserDetails,
    clearUserDetails,
    updateAddresses,
    
    // Async thunks
    fetchUserDetails,
    addAddress,
    updateAddress,
    deleteAddress,
    updateUserDetails,
};

// Default export for the reducer
export default userSlice.reducer;