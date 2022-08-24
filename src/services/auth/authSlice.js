import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
  console.log(result);
  if (!tokenData) throw new Error("token doesn't exits");

  return {
    token: tokenData,
    data: result.data,
  };
});

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
  },
  reducers: {
    logout: {
      reducer: (state) => {
        state.token = "";
        state.user.id = null;
        state.user.name = null;
        state.user.email = null;
        state.user.gender = null;
      },
      prepare: () => {
        token.reset();

        return { payload: null };
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        const userInfo = action.payload.user;
        state.token = action.payload.token;
        state.user.id = userInfo.id;
        state.user.name = userInfo.name;
        state.user.email = userInfo.email;
        state.loading = false;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        const userInfo = action.payload.user;
        state.token = action.payload.token;
        state.user.id = userInfo.id;
        state.user.name = userInfo.name;
        state.user.email = userInfo.email;
        state.loading = false;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        const userInfo = action.payload.data;
        state.token = action.payload.token;
        state.user.id = userInfo.id;
        state.user.name = userInfo.name;
        state.user.email = userInfo.email;
        state.loading = false;
      })
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(signupThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getUserInfo.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;

export const { logout } = authSlice.actions;
