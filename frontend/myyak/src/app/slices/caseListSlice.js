import { createSlice } from "@reduxjs/toolkit";

const caseListSlice = createSlice({
  name: "caseList",
  initialState: {
    caseList: []
  },
  reducers: {
    caseListUpdate: (state, action) => {
      state.caseList = action.payload;
    }
  }
})

export const { caseListUpdate } = caseListSlice.actions;

export default caseListSlice;