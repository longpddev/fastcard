'use client';

import { configureStore } from '@reduxjs/toolkit';
import { run, token, watchThunk } from '@/functions/common';
import authSlice, { getUserInfo } from '@/services/auth/authSlice';
import cardSlice, {
  getCardLearnTodayThunk,
  getGroupCardThunk,
} from '@/services/card/cardSlice';
import { queryApi } from '@/services/queryApi';
import videoTranscriptSlice from '@/services/videoTranscript/videoTranscriptSlice';

const rootReducer = {
  [queryApi.reducerPath]: queryApi.reducer,
  auth: authSlice,
  card: cardSlice,
  videoTranscript: videoTranscriptSlice,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(queryApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type StoreDispatch = ReturnType<typeof store.dispatch>;
export type AppDispatch = typeof store.dispatch;
// fetch data init when user has login before
run(async () => {
  const tokenData = token.get();
  if (!tokenData) return;
  const { dispatch, getState } = store;

  await Promise.all([dispatch(getUserInfo()), dispatch(getGroupCardThunk())]);

  await dispatch(getCardLearnTodayThunk());
});
