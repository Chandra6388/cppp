// src/slice/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { get_All_Notification } from "@/service/User/notificationService";
interface NotificationArr {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
  type: string;
  userId: string;
  reciverId: string;
  readerType: string;
}

interface UserState {
  isLoading: boolean;
  isError: boolean;
  getallnotification: NotificationArr[];
}

const initialState: UserState = {
  isLoading: false,
  isError: false,
  getallnotification: [],
};

export const getAllNotification = createAsyncThunk(
  "user/getAllNotification",
  async (data: any, thunkAPI) => {
    try {
      const res = await get_All_Notification(data);
      return res;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotification.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllNotification.fulfilled, (state, action: PayloadAction<Notification>) => {
        state.isLoading = false;
        state.getallnotification = action.payload.data;
      })
      .addCase(getAllNotification.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default userSlice.reducer;
