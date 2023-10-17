import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ROUTES } from "../../api/apiConfig";
import axiosInstance from "../../api/axiosInstance";

const initialState = {
  friends: [
    { id: 1, name: "Alix"},
    { id: 2, name: "Sara"},
    { id: 3, name: "Alice"},
  ],
  pendingRequests: [
    { id: 4, name: "Anna" },
    { id: 5, name: "Elsa" },
  ],
  error: null,
  loading: "idle",
};

export const fetchFriends = createAsyncThunk(
  "friendship/fetchFriends",
  async (userId) => {
    try {
      const response = await axiosInstance.get(API_ROUTES.fetchFriends + { userId });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("An error occurred while fetching friends");
    }
  }
);
export const sendFriendRequestAsync = createAsyncThunk(
  "friendship/sendFriendRequest",
  async (recipientUserId) => {
    try {
      const response = await axiosInstance.post(API_ROUTES.sendFriendRequest, {
        recipientUserId,
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
  async (senderUserId) => {
    try {
      const response = await axiosInstance.post(
        API_ROUTES.acceptFriendRequest,
        senderUserId
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
        const response = await axiosInstance.delete(API_ROUTES.removeFriend + friendId)
        const data = await response.data
        return data;
    } catch (error) {
      console.error("Failed to remove friend", error.message);
      throw error;
    }
  }
)

const friendshipSlice = createSlice({
  name: "friendship",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        console.log("Pending");
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.friends = action.payload;
        state.loading = "succeeded";
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(sendFriendRequestAsync.pending, (state) => {
        console.log("Friend request pending...");
      })
      .addCase(sendFriendRequestAsync.fulfilled, (state, action) => {
        state.pendingRequests = action.payload;
        state.loading = "succeeded";
      })
      .addCase(sendFriendRequestAsync.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;   
      })
      .addCase(acceptFriendRequestAsync.pending, (state) => {
        console.log("Friend request pending...");
      }) 
      .addCase(acceptFriendRequestAsync.fulfilled, (state, action) => {
        state.friends = action.payload;
        state.loading = "succeeded";
      }) 
      .addCase(removeFriendRequestAsync.pending, (state) => {
        console.log("Remove friend request pending");
      })
      .addCase(removeFriendRequestAsync.fulfilled, (state, action) => {
        state.friends = state.friends.filter((friend) => friend.id !== action.payload.friendId)
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