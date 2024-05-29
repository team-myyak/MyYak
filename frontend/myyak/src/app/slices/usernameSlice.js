import { createSlice } from "@reduxjs/toolkit";

const usernameSlice = createSlice({
  name: "username",
  initialState: {
    username: null
  },
  reducers: {
    usernameUpdate: (state, action) => {
      state.username = action.payload;
    }
  }
})

export const { usernameUpdate } = usernameSlice.actions;

export default usernameSlice;