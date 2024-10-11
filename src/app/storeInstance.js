import { configureStore } from '@reduxjs/toolkit';
import createRootReducer from '../features/rootReducer';

let storeInstance = null;

export const getStore = () => {
  if (!storeInstance) {
    const rootReducer = createRootReducer();
    storeInstance = configureStore({
      reducer: rootReducer,
    });
  }
  return storeInstance;
};

export const dispatch = (action) => getStore().dispatch(action);