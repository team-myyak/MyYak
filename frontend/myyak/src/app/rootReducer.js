import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "./slices/authSlice";
import urlSlice from "./slices/urlSlice";
import caseListSlice from "./slices/caseListSlice";
import connectedCaseSlice from "./slices/connectedCaseSlice";
import usernameSlice from "./slices/usernameSlice";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  url: urlSlice.reducer,
  caseList: caseListSlice.reducer,
  connectedCase: connectedCaseSlice.reducer,
  username: usernameSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;