import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { run, token } from "../functions/common";
import authSlice, { getUserInfo } from "../services/auth/authSlice";
import { queryApi } from "../services/queryApi";

export const store = configureStore({
  reducer: {
    [queryApi.reducerPath]: queryApi.reducer,
    auth: authSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(queryApi.middleware),
});

run(() => {
  const tokenData = token.get();
  if (!tokenData) return;
  console.log(tokenData);
  const { dispatch } = store;

  dispatch(getUserInfo());
});
