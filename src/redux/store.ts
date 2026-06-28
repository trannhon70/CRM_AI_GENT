import { configureStore } from '@reduxjs/toolkit';
import { usersReducer } from '../features/usersSlice';
import { fanPagesReducer } from '../features/fanpagesSlice';
import { conversationReducer } from '../features/conversationSlice';
import { liveMessageReducer } from '../features/liveMessageSlice';


export const store = configureStore({
  reducer: {
    users: usersReducer,
    fanPages: fanPagesReducer,
    conversation: conversationReducer,
    message: liveMessageReducer,
  },
});

// Định nghĩa RootState và AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
