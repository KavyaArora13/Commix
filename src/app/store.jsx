import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../features/rootReducer';

const store = configureStore({
  reducer: rootReducer,
  // You can add middleware here if needed
});

export default store;