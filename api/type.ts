export type IRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type IRequestBody =
  | Record<string | number, any>
  | FormData
  | string
  | undefined;
export type IEventProgress = (loaded: number, total: number) => void;
export type IRequestBase = { statusCode: number; message: string };
export interface IEndPoint {
  endPoint: string;
  body: IRequestBody;
  params: Record<string, string | number> | undefined;
  paramsEndPoint: Record<string, string | number> | undefined;
  response: any;
  options: any;
}

export interface IEndPointUploadFile extends IEndPoint {
  body: Record<string, string | number | Blob>;
}

export interface IEndPointCreator<
  EndPoint extends string,
  Body extends IRequestBody | undefined,
  Params extends Record<string, string | number> | undefined,
  ParamsEndPoint extends Record<string, string | number> | undefined,
  Response extends any,
> extends IEndPoint {
  endPoint: EndPoint;
  body: Body;
  params: Params;
  response: Response;
  paramsEndPoint: ParamsEndPoint;
  options: MergeOptions<
    Body,
    {
      body: Body;
    },
    MergeOptions<
      Params,
      {
        params: Params;
      },
      ParamsEndPoint,
      {
        paramsEndPoint: ParamsEndPoint;
      },
      undefined
    >,
    undefined,
    null
  >;
}

export interface IEndPointUploadCreator<
  EndPoint extends string,
  Body extends Record<string, string | number | Blob>,
  Params extends Record<string, string | number> | undefined,
  ParamsEndPoint extends Record<string, string | number> | undefined,
  Response extends any,
> extends IEndPointUploadFile {
  endPoint: EndPoint;
  body: Body;
  params: Params;
  response: Response;
  paramsEndPoint: ParamsEndPoint;
}

export type Pickey<
  Object extends Record<string, any>,
  Key extends string,
> = Object[Key];

export type Infer<T extends unknown, V extends unknown> = T extends undefined
  ? V
  : T;

export type MergeOptions<
  T extends unknown,
  TV extends unknown,
  H extends unknown,
  HV extends unknown,
  DF = undefined,
> = T extends undefined
  ? H extends undefined
    ? DF
    : Infer<HV, H>
  : H extends undefined
  ? Infer<TV, T>
  : Infer<TV, T> & Infer<HV, H>;

export type MergeOb<T extends unknown> = {
  [K in keyof T]: T[K];
};

export type IRequestEvents = {
  onProgress?: IEventProgress;
  onProgressUpload?: IEventProgress;
};
