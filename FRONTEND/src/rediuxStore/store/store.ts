// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/user/userSlice"; // Rename for clarity

export const store = configureStore({
  reducer: {
    user: userReducer, // Change the key from `userSlice` to `user`
  },
});

// 👇 Type exports for use in hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
