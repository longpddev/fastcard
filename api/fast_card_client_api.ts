import { IEndPointCreator } from './client';

type ResponseFormat<
  Data extends unknown,
  Mess extends string = '',
  Code extends number = 200,
> = {
  data: Data;
  message: Mess;
  statusCode: Code;
};

export type IUserSettings = {
  cardAnimate: 'slide' | 'fade' | 'none';
  maxCardInDay: number;
};
export type IGender = 'male' | 'female';

export type IUserInfo = {
  email: string;
  gender: null | IGender;
  id: number;
  name: string;
  settings: IUserSettings;
  createdAt?: string;
  updatedAt?: string;
};

export type IEndPointUserSettings = IEndPointCreator<
  '/users/settings',
  {
    settings: IUserSettings;
  },
  undefined,
  ResponseFormat<number>
>;

export type IEndPointAuthUserInfo = IEndPointCreator<
  '/auth/user-info',
  undefined,
  undefined,
  ResponseFormat<IUserInfo>
>;

export type IEndPointAuthLogin = IEndPointCreator<
  '/auth/login',
  {
    username: string;
    password: string;
  },
  undefined,
  ResponseFormat<{
    user: IUserInfo;
    token: string;
  }>
>;

export type IEndPointAuthSignup = IEndPointCreator<
  '/auth/signup',
  {
    name: string;
    email: string;
    password: string;
  },
  undefined,
  ResponseFormat<{
    user: IUserInfo;
    token: string;
  }>
>;

export type IEndPointAuthUserUpdate = IEndPointCreator<
  '/users',
  {
    name: string;
  },
  undefined,
  ResponseFormat<number>
>;

export type IEndPointAuthUserChangePassword = IEndPointCreator<
  '/auth/change-password',
  {
    oldPassword: string;
    newPassword: string;
  },
  undefined,
  ResponseFormat<{
    user: IUserInfo;
    token: string;
  }>
>;
