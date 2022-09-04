import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "ramda";
import client, { clientAuth } from "../../api/client";
import { encodePassword, token } from "../../functions/common";

export const loginThunk = createAsyncThunk(
  "auth/loginThunk",
  async ({ email, password }) => {
    const result = await client.POST("/auth/login", {
      body: {
        username: email,
        password: encodePassword(password),
      },
    });
    token.set(result.data.token);
    return result.data;
  }
);

export const signupThunk = createAsyncThunk(
  "auth/signupThunk",
  async ({ email, password }) => {
    const result = await client.POST("/auth/signup", {
      body: {
        name: email,
        email,
        password: encodePassword(password),
      },
    });

    token.set(result.data.token);
    return result;
  }
);

export const getUserInfo = createAsyncThunk("auth/get_user_info", async () => {
  const result = await clientAuth.GET("/auth/user-info");
  const tokenData = token.get();
  if (!tokenData) throw new Error("token doesn't exits");

  return {
    token: tokenData,
    user: result.data,
  };
});

export const syncAccountSettingsThunk = createAsyncThunk(
  "auth/syncAccountSettings",
  async (_, { getState }) => {
    const settings = getState().auth.settings;

    if (isEmpty(settings)) throw new Error("settings is empty");

    const result = await clientAuth.PUT("/users/settings", {
      body: {
        settings,
      },
    });

    return result.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    token: "",
    user: {
      id: null,
      name: null,
      email: null,
      gender: null,
    },
    settings: {},
  },
  reducers: {
    logout: {
      reducer: (state) => {
        state.token = "";
        state.user.id = null;
        state.user.name = null;
        state.user.email = null;
        state.user.gender = null;
        state.settings = {};
      },
      prepare: () => {
        token.reset();

        return { payload: null };
      },
    },
    changeSettings: (state, { payload }) => {
      state.settings[payload.key] = payload.value;
    },
  },
  extraReducers: (builder) => {
    const caseUserInfo = (state, action) => {
      const userInfo = action.payload.user;
      state.token = action.payload.token;
      state.user.id = userInfo.id;
      state.user.name = userInfo.name;
      state.user.email = userInfo.email;
      state.settings = userInfo.settings;
      state.loading = false;
    };

    const caseUserLoading = (state) => {
      state.loading = true;
    };

    const caseUserLoaded = (state) => {
      state.loading = false;
    };
    builder
      .addCase(loginThunk.fulfilled, caseUserInfo)
      .addCase(signupThunk.fulfilled, caseUserInfo)
      .addCase(getUserInfo.fulfilled, caseUserInfo)
      .addCase(loginThunk.pending, caseUserLoading)
      .addCase(signupThunk.pending, caseUserLoading)
      .addCase(getUserInfo.pending, caseUserLoading)
      .addCase(loginThunk.rejected, caseUserLoaded)
      .addCase(signupThunk.rejected, caseUserLoaded)
      .addCase(getUserInfo.rejected, caseUserLoaded);
  },
});

export default authSlice.reducer;

export const { logout, changeSettings } = authSlice.actions;
