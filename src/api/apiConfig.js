const BASE_URL = "http://localhost:3001"; // if we include the "/" we have to take care not to include it in routes
const API_ROUTES = {
  //  define routes here, so we can use them without making spelling mistakes
  login: "/auth/login",
  register: "/auth/register",
  fetchFriends: "",
  sendFriendRequest: "",
  acceptFriendRequest: "",
  rejectFriendRequest: "",
  removeFriend: "",
};

export { BASE_URL, API_ROUTES };
