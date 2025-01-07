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
    resetCart: (state) => {
      state.itemCount = 0;
    },
  },
});

export const { updateCartItemCount, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
