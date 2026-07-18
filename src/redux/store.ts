import { configureStore } from '@reduxjs/toolkit';
import { usersReducer } from '../features/usersSlice';
import { fanPagesReducer } from '../features/fanpagesSlice';
import { conversationReducer } from '../features/conversationSlice';
import { liveMessageReducer } from '../features/liveMessageSlice';
import { labelReducer } from '../features/labelSlice';


export const store = configureStore({
  reducer: {
    users: usersReducer,
    fanPages: fanPagesReducer,
    conversation: conversationReducer,
    message: liveMessageReducer,
    label: labelReducer,
  },
});

// Định nghĩa RootState và AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
