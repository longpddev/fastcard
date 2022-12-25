import { IEndPointCreator } from './type';

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
  undefined,
  ResponseFormat<number>
>;

export type IEndPointAuthUserUpdate = IEndPointCreator<
  '/users',
  {
    name: string;
  },
  undefined,
  undefined,
  ResponseFormat<number>
>;

export type IEndPointAuthUserInfo = IEndPointCreator<
  '/auth/user-info',
  undefined,
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
  undefined,
  ResponseFormat<{
    user: IUserInfo;
    token: string;
  }>
>;

export type IEndPointAuthUserChangePassword = IEndPointCreator<
  '/auth/change-password',
  {
    oldPassword: string;
    newPassword: string;
  },
  undefined,
  undefined,
  ResponseFormat<{
    user: IUserInfo;
    token: string;
  }>
>;

export interface ICardGroup {
  description: null | string;
  name: string;
  userId: number;
}

export interface ICardGroupResponse extends ICardGroup {
  createdAt: string;
  id: number;
  updatedAt: string;
}

export type IEndPointGroupCardGet = IEndPointCreator<
  '/group-card',
  undefined,
  undefined,
  undefined,
  ResponseFormat<{
    count: number;
    rows: Array<ICardGroupResponse>;
  }>
>;

export type IEndPointGroupCardCreate = IEndPointCreator<
  '/group-card',
  {
    name: string;
  },
  undefined,
  undefined,
  ResponseFormat<{
    count: number;
    rows: Array<ICardGroupResponse>;
  }>
>;

export type IEndPointGroupCardUpdate = IEndPointCreator<
  '/group-card/:id',
  { name: string },
  undefined,
  {
    id: number;
  },
  ResponseFormat<number>
>;

export type IEndPointGroupCardDelete = IEndPointCreator<
  '/group-card/:id',
  undefined,
  undefined,
  {
    id: number;
  },
  ResponseFormat<number>
>;
export interface IImage {
  height: number;
  name: string;
  path: string;
  width: number;
}

export interface IImageResponse extends IImage {
  createdAt: string;
  id: number;
  updatedAt: string;
}

export type ICardStepType = 'question' | 'answer' | 'explain';

export type ICardStep = {
  cardGroupId: number;
  cardId: number;
  content: string;
  imageId: number;
  type: ICardStepType;
};

export interface ICardStepResponse extends ICardStep {
  createdAt: string;
  id: number;
  image: IImageResponse;
  updatedAt: string;
}

export type IEndPointCardStepUpdate = IEndPointCreator<
  '/card/step/:id',
  ICardStep,
  undefined,
  {
    id: number;
  },
  ResponseFormat<number>
>;

export type Card = {
  backCard: ICardStepResponse;
  backCardId: number;
  cardGroupId: number;
  cardMainId: number;
  createdAt: string;
  frontCard: ICardStepResponse;
  frontCardId: number;
  id: number;
  timeLastLearn: string;
  timeNextLearn: string;
  times: number;
  updatedAt: string;
};

export type IEndPointCardLearnToday = IEndPointCreator<
  '/card/learn-today',
  undefined,
  {
    limit: number;
    groupId: number;
  },
  undefined,
  ResponseFormat<{
    count: number;
    rows: Array<Card>;
  }>
>;

export type IEndPointCardDelete = IEndPointCreator<
  '/card/:id',
  undefined,
  undefined,
  {
    id: number;
  },
  ResponseFormat<number>
>;

export type ICardStepCreate = {
  imageId: number | null;
  content: string;
  type: ICardStepType;
  cardGroupId: number;
};
export type IEndPointCardCreate = IEndPointCreator<
  '/card',
  {
    info: {
      cardGroupId: number;
    };
    cardQuestion: ICardStepCreate;
    cardAnswer: ICardStepCreate;
    cardExplain: ICardStepCreate;
  },
  undefined,
  undefined,
  ResponseFormat<{
    cardGroupId: number;
    createdAt: string;
    id: number;
    updatedAt: string;
    userId: number;
  }>
>;

export type IEndPointCardNoExplainCreate = IEndPointCreator<
  '/card/noexplain',
  {
    info: {
      cardGroupId: number;
    };
    cardQuestion: ICardStepCreate;
    cardAnswer: ICardStepCreate;
  },
  undefined,
  undefined,
  ResponseFormat<{
    cardGroupId: number;
    createdAt: string;
    id: number;
    updatedAt: string;
    userId: number;
  }>
>;

export type IEndPointCardChangeGroup = IEndPointCreator<
  '/card/:id/changeGroup',
  { groupId: number },
  undefined,
  {
    id: number;
  },
  ResponseFormat<number>
>;

export type IEndPointCardLearnedUpdate = IEndPointCreator<
  '/card/learned',
  { cardId: number; isHard: boolean },
  undefined,
  undefined,
  ResponseFormat<number>
>;

export type IFileResponse = {
  filename: string;
  id: number;
  path: string;
};
export type IEndPointImageUpload = IEndPointCreator<
  '/image/upload',
  { file: File; width: number; height: number },
  undefined,
  undefined,
  ResponseFormat<IFileResponse>
>;

export type IEndPointImageUpdate = IEndPointCreator<
  '/image/:id',
  { file: File; width: number; height: number },
  undefined,
  {
    id: number;
  },
  ResponseFormat<IFileResponse, '', 201>
>;

/**
 * Start Video endpoint
 */

export type IEndPointVideoInitUploadProcess = IEndPointCreator<
  '/video/upload-multiple/init',
  undefined,
  undefined,
  undefined,
  ResponseFormat<
    {
      tokenUpload: string;
    },
    '',
    201
  >
>;

export type IEndPointVideoUploadPartFile = IEndPointCreator<
  '/video/upload-multiple/file',
  {
    file: File;
    index: number;
    size: number;
    totalFile: number;
    tokenUpload: string;
  },
  undefined,
  undefined,
  ResponseFormat<
    {
      tokenUpload: string;
    },
    '',
    201
  >
>;

export interface VideoMetadata {
  progressIndex: number;
}
export interface IVideo {
  userId: number;
  title: string;
  name: string;
  description: string;
  thumbnailId: number;
  width: number;
  height: number;
  metadata: VideoMetadata;
  transcript: string;
  path: string;
  id: number;
  updatedAt: string;
  createdAt: string;
}

export interface IVideoFieldUpdatable {
  path: string;
  name: string;
  title: string;
  description: string;
  thumbnailId: number;
  width: number;
  height: number;
  metadata: VideoMetadata;
  transcript: string;
}

export interface IVideoResponse extends IVideo {
  thumbnail: IImageResponse;
}

export type IEndPointVideoMergePartFiles = IEndPointCreator<
  '/video/upload-multiple/merge',
  {
    tokenUpload: string;
  },
  undefined,
  undefined,
  ResponseFormat<boolean, '', 201>
>;

export type IVideoFormat = 'mp4';
export type IEndPointVideoUploadFinally = IEndPointCreator<
  '/video/upload',
  {
    data: {
      title: string;
      name: string;
      description: string;
      thumbnailId: number;
      width: number;
      height: number;
      metadata: string;
      transcript: string;
    };
    tokenUpload: string;
    extension: IVideoFormat;
  },
  undefined,
  undefined,
  ResponseFormat<IVideo, '', 201>
>;

export type IEndPointVideoGet = IEndPointCreator<
  '/video/:id',
  undefined,
  undefined,
  {
    id: number;
  },
  ResponseFormat<IVideoResponse>
>;

export type IEndPointVideoUpdateData = IEndPointCreator<
  '/video/:id',
  Partial<IVideoFieldUpdatable>,
  undefined,
  {
    id: number;
  },
  ResponseFormat<IVideoResponse>
>;

export type IEndPointVideoUpdateFile = IEndPointCreator<
  '/video/:id/change-video',
  {
    file: File;
    width: number;
    height: number;
  },
  undefined,
  {
    id: number;
  },
  ResponseFormat<IVideoResponse>
>;

export type IEndPointVideoDelete = IEndPointCreator<
  '/video/:id',
  undefined,
  undefined,
  {
    id: number;
  },
  ResponseFormat<number>
>;

export type IEndPointGetListCardResponse = ResponseFormat<{
  count: number;
  rows: Array<{
    cardGroupId: number;
    createAt: string;
    updateAt: string;
    userId: number;
    id: number;
    cardStep: Array<ICardStepResponse>;
  }>;
}>;
