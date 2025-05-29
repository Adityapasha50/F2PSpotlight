import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './features/gamesSlice';
import authReducer from './features/authSlice';

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    auth: authReducer
  },
});