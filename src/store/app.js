import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { run, token, watchThunk } from "../functions/common";
import authSlice, { getUserInfo } from "../services/auth/authSlice";
import cardSlice, {
  getCardLearnTodayThunk,
  getGroupCardThunk,
} from "../services/card/cardSlice";
import { queryApi } from "../services/queryApi";

export const store = configureStore({
  reducer: {
    [queryApi.reducerPath]: queryApi.reducer,
    auth: authSlice,
    card: cardSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(queryApi.middleware),
});

// fetch data init when user has login before
run(async () => {
  const tokenData = token.get();
  if (!tokenData) return;
  const { dispatch } = store;

  await dispatch(getUserInfo());
  await dispatch(getGroupCardThunk());
  await dispatch(getCardLearnTodayThunk());
});
