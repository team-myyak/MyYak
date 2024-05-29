import { createSlice } from "@reduxjs/toolkit";

const connectedCaseSlice = createSlice({
  name: "connectedCase",
  initialState: {
    connectedCase: {}
  },
  reducers: {
    connectedCaseUpdate: (state, action) => {
      state.connectedCase = action.payload;
    }
  }
})

export const { connectedCaseUpdate } = connectedCaseSlice.actions;

export default connectedCaseSlice;