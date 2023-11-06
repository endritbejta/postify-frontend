import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ROUTES } from "../../api/apiConfig";
import axiosInstance from "../../api/axiosInstance";

const initialState = {
  friends: [],
  pendingRequests: [],
  sentRequests: [],
  error: null,
  loading: "idle",
};

export const fetchFriends = createAsyncThunk(
  "friendship/fetchFriends",
  async (userId) => {
    try {
      const response = await axiosInstance.post(API_ROUTES.getFriendRequest, {
        userId,
      });
      const data = await response.data;
      return data;
    } catch (error) {}
  }
);
export const sendFriendRequestAsync = createAsyncThunk(
  "friendship/sendFriendRequest",
  async ({ recipientUserId, senderUserId }) => {
    try {
      const response = await axiosInstance.post(API_ROUTES.friendRequest, {
        requestTo: recipientUserId,
        user: { userId: senderUserId },
      });

      const data = await response.data;

      return data;
    } catch (error) {
      console.error("Failed to send friend request", error.message);
      throw error;
    }
  }
);

export const acceptFriendRequestAsync = createAsyncThunk(
  "friendship/acceptFriendRequest",
  async ({ rid, senderUserId, status }) => {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.acceptFriendRequest,
        {
          rid: rid,
          user: { userId: senderUserId },
          status: status,
        }
      );
      const data = await response.data;
      return data;
    } catch (error) {
      console.error("Failed to accept friend", error.message);
      throw error;
    }
  }
);

export const rejectFriendRequestAsync = createAsyncThunk(
  "friendship/rejectFriendRequest",
  async (friendId) => {
    try {
      const response = await axiosInstance.delete(
        API_ROUTES.rejectFriendRequest + friendId
      );
      const data = await response.data;
      return data;
    } catch (error) {
      console.error("Failed to reject friend", error.message);
      throw error;
    }
  }
);

export const removeFriendRequestAsync = createAsyncThunk(
  "friendship/removeFriend",
  async (friendId) => {
    try {
      const response = await axiosInstance.delete(
        API_ROUTES.removeFriend + friendId
      );
      const data = await response.data;
      return data;
    } catch (error) {
      console.error("Failed to remove friend", error.message);
      throw error;
    }
  }
);

const friendshipSlice = createSlice({
  name: "friendship",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {})
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.pendingRequests = action.payload.data;
        state.loading = "succeeded";
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(sendFriendRequestAsync.pending, (state) => {})
      .addCase(sendFriendRequestAsync.fulfilled, (state, action) => {
        state.sentRequests = action.payload.data;

        state.loading = "succeeded";
      })
      .addCase(sendFriendRequestAsync.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(acceptFriendRequestAsync.pending, (state) => {})
      .addCase(acceptFriendRequestAsync.fulfilled, (state, action) => {
        state.friends = action.payload;
        state.pendingRequests = state.pendingRequests.filter(
          (friend) => friend.requestFrom._id !== action.payload.senderUserId
        );
        state.loading = "succeeded";
      })
      .addCase(acceptFriendRequestAsync.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(removeFriendRequestAsync.pending, (state) => {})
      .addCase(removeFriendRequestAsync.fulfilled, (state, action) => {
        state.friends = state.friends.filter(
          (friend) => friend.id !== action.payload.friendId
        );
      })
      .addCase(removeFriendRequestAsync.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

// export const {

// } = friendshipSlice.actions;

export default friendshipSlice.reducer;
