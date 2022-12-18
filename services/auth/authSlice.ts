import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isEmpty } from 'ramda';
import client, { clientAuth } from '../../api/client';
import { encodePassword, token } from '../../functions/common';
import { RootState } from 'store/app';
import {
  IEndPointAuthLogin,
  IEndPointAuthSignup,
  IEndPointAuthUserChangePassword,
  IEndPointAuthUserInfo,
  IEndPointAuthUserUpdate,
  IEndPointUserSettings,
  IGender,
  IUserSettings,
} from '@/api/fast_card_client_api';
import { PromiseResult, Valueof } from '@/interfaces/common';

export const loginApi = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const result = await client.POST<IEndPointAuthLogin>('/auth/login', {
    body: {
      username: email,
      password: encodePassword(password),
    },
  });

  token.set(result.data.token);
  return result.data;
};

export const loginThunk = createAsyncThunk(
  'auth/loginThunk',
  async ({ email, password }: { email: string; password: string }) => {
    return loginApi({ email, password });
  },
);

export const signupApi = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const result = await client.POST<IEndPointAuthSignup>('/auth/signup', {
    body: {
      name: email,
      email,
      password: encodePassword(password),
    },
  });

  token.set(result.data.token);
  return result.data;
};

export const signupThunk = createAsyncThunk(
  'auth/signupThunk',
  async ({ email, password }: { email: string; password: string }) => {
    return signupApi({ email, password });
  },
);

export const getUserInfoApi = async () => {
  const result = await clientAuth.GET<IEndPointAuthUserInfo>(
    '/auth/user-info',
    null,
  );
  const tokenData = token.get();
  if (!tokenData) throw new Error("token doesn't exits");

  return {
    token: tokenData as string,
    user: result.data,
  };
};

export type getUserInfoApiResponse = PromiseResult<typeof getUserInfoApi>;

export const getUserInfo = createAsyncThunk('auth/get_user_info', async () => {
  return await getUserInfoApi();
});

export const syncAccountSettingsApi = async (settings: IUserSettings) => {
  if (isEmpty(settings)) throw new Error('settings is empty');

  const result = await clientAuth.PUT<IEndPointUserSettings>(
    '/users/settings',
    {
      body: {
        settings,
      },
    },
  );

  return result.data;
};
export const syncAccountSettingsThunk = createAsyncThunk(
  'auth/syncAccountSettings',
  async (_, { getState }) => {
    const settings = (getState() as RootState).auth.settings;
    return await syncAccountSettingsApi(settings);
  },
);

export const updateAccountApi = async ({ username }: { username: string }) => {
  return await clientAuth.PUT<IEndPointAuthUserUpdate>('/users', {
    body: {
      name: username,
    },
  });
};

export const updateAccountThunk = createAsyncThunk(
  'auth/updateAccount',
  async ({ username }: { username: string }) => {
    return await updateAccountApi({ username });
  },
);

export const changePasswordApi = async ({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) => {
  const result = await clientAuth.PUT<IEndPointAuthUserChangePassword>(
    '/auth/change-password',
    {
      body: {
        oldPassword: encodePassword(oldPassword),
        newPassword: encodePassword(newPassword),
      },
    },
  );

  return result;
};

export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async ({
    oldPassword,
    newPassword,
  }: {
    oldPassword: string;
    newPassword: string;
  }) => {
    return await changePasswordApi({ oldPassword, newPassword });
  },
);

const settingsDefault = (): IUserSettings => ({
  cardAnimate: 'none',
  maxCardInDay: 30,
});

const initialState = () => {
  const result: {
    loading: boolean;
    token: string;
    user: null | {
      email: string;
      gender: null | IGender;
      id: number;
      name: string;
    };
    settings: IUserSettings;
  } = {
    loading: false,
    token: '',
    user: null,
    settings: settingsDefault(),
  };
  return result;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState(),
  reducers: {
    logout: {
      reducer: (state) => {
        state.token = '';
        state.user = null;
        state.settings = settingsDefault();
      },
      prepare: () => {
        token.reset();

        return { payload: null };
      },
    },
    changeSettings: (
      state,
      {
        payload,
      }: {
        payload: Valueof<{
          [K in keyof IUserSettings]: {
            key: K;
            value: IUserSettings[K];
          };
        }>;
      },
    ) => {
      const key = payload.key;
      state.settings = {
        ...state.settings,
        [key]: payload.value as IUserSettings[typeof key],
      };
    },
    loginAction: (
      state,
      { payload }: PayloadAction<IEndPointAuthLogin['response']['data']>,
    ) => {
      const userInfo = payload.user;
      state.token = payload.token;
      state.user = userInfo;
      state.loading = false;
    },
    signUpAction: (
      state,
      { payload }: PayloadAction<IEndPointAuthSignup['response']['data']>,
    ) => {
      const userInfo = payload.user;
      state.token = payload.token;
      state.user = userInfo;
      state.loading = false;
    },
    setUserInfoAction: (
      state,
      { payload }: PayloadAction<PromiseResult<typeof getUserInfoApi>>,
    ) => {
      const userInfo = payload.user;
      state.token = payload.token;
      state.user = userInfo;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        const userInfo = action.payload.user;
        state.token = action.payload.token;
        state.user = userInfo;
        state.loading = false;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        const userInfo = action.payload.user;
        state.token = action.payload.token;
        state.user = userInfo;
        state.loading = false;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        const userInfo = action.payload.user;
        state.token = action.payload.token;
        state.user = userInfo;
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

export const {
  logout,
  changeSettings,
  loginAction,
  signUpAction,
  setUserInfoAction,
} = authSlice.actions;
