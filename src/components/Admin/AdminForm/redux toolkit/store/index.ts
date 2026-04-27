 import { configureStore } from '@reduxjs/toolkit';
import adminFormReducer from '../slices/adminFormSlice';

export const adminFormStore = configureStore({
  reducer: {
    adminForm: adminFormReducer,
  },
});

export type AdminFormRootState = ReturnType<typeof adminFormStore.getState>;
export type AdminFormDispatch = typeof adminFormStore.dispatch;


