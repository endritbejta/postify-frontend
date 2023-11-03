import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { API_ROUTES } from "../../api/apiConfig";

const initialState = {
  user: "",
  status: "idle",
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  "profilePage/fetchUserProfile",
  async (id) => {
    try {
      const response = await axiosInstance.get(API_ROUTES.users + id);
      return response.data;
    } catch (err) {
      throw new Error(err.response.deta.error);
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "profilePage/fetchUserDetails",
  async (id) => {
    try {
      console.log(API_ROUTES.users + "/" + id + "/about");
      return await axiosInstance.get(API_ROUTES.users + "/" + id + "/about");
    } catch (err) {
      throw new Error(err.response.deta.error);
    }
  }
);

const profileSlice = createSlice({
  name: "profilePage",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.user = action.error.message;
      });
  },
});

export const selectProfilePageUser = (state) => state.profile.user;
export const selectProfilePageUserStatus = (state) => state.profile.status;
export const selectProfilePageUserError = (state) => state.profile.error;

export const { setUser } = profileSlice.actions;

export default profileSlice.reducer;
