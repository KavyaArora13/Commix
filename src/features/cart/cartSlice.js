import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    itemCount: 0,
  },
  reducers: {
    updateCartItemCount: (state, action) => {
      state.itemCount = action.payload;
    },
  },
});

export const { updateCartItemCount } = cartSlice.actions;
export default cartSlice.reducer;
