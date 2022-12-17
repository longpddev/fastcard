import {
  isCurrentOrigin,
  isValidUrl,
  splitParamsEndpoint,
  token,
} from '../functions/common';

type IRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type IRequestBody =
  | Record<string | number, any>
  | FormData
  | string
  | undefined;
type IEventProgress = (loaded: number, total: number) => void;
type IRequestOptions = {
  params?: Record<string, string>;
  body?: IRequestBody;
};
interface IEndPoint {
  endPoint: string;
  body: IRequestBody;
  params: Record<string, string | number> | undefined;
  paramsEndPoint: Record<string, string | number> | undefined;
  response: any;
  options: any;
}

interface IEndPointUploadFile extends IEndPoint {
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

type Pickey<
  Object extends Record<string, any>,
  Key extends string,
> = Object[Key];

type Infer<T extends unknown, V extends unknown> = T extends undefined ? V : T;

type MergeOptions<
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

type MergeOb<T extends unknown> = {
  [K in keyof T]: T[K];
};

type IRequestEvents = {
  onProgress?: IEventProgress;
  onProgressUpload?: IEventProgress;
};
type ICreateMethodXMLHttpRequest<T> = (
  point: string,
  method: IRequestMethod,
  body: IRequestBody,
  headers: Headers | undefined,
  events: IRequestEvents,
) => Promise<T>;

const handleError = (error: any) => {
  console.error(error);
};

const defaultHeaders = new Headers({
  'Content-Type': 'application/json',
});

const formatBody = (body?: IRequestBody) => {
  const isObject = typeof body === 'object';
  const isEmpty = !Boolean(body);
  // const isFormData = body instanceof FormData;
  // if (isFormData) return body;
  if (isEmpty) return undefined;
  if (isObject) return JSON.stringify(body);
  return body;
};

export const baseUrl = `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1`;
const createMethodFetchRequest = async <T extends unknown>(
  point: string,
  method: IRequestMethod,
  body: IRequestBody = undefined,
  headers: Headers | undefined = defaultHeaders,
  events: IRequestEvents,
): Promise<T> => {
  const result = await fetch(`${baseUrl}${point}`, {
    method,
    body: formatBody(body),
    headers: headers
      ? headers
      : {
          'Content-Type': 'application/json',
        },
  });
  let isOk = result.ok;
  const resultJson = (await result.json()) as T;
  if (!isOk) {
    return Promise.reject(resultJson);
  }

  return resultJson;
};

const createMethodXMLHttpRequest = <T extends unknown>(
  point: string,
  method: IRequestMethod,
  body: IRequestBody = undefined,
  headers: Headers | undefined = defaultHeaders,
  { onProgress, onProgressUpload }: IRequestEvents,
): Promise<T> => {
  return new Promise((res, rej) => {
    try {
      const xhr = new XMLHttpRequest();
      // cos origin
      xhr.withCredentials = false;

      if (!(headers instanceof Headers))
        throw new Error('header must is instanceof Headers');

      xhr.onload = function () {
        if (xhr.status == 404 || xhr.status == 406 || xhr.status === 401) {
          rej(xhr.response);
          return;
        }

        res(xhr.response);
      };
      xhr.onprogress = function (e) {
        onProgress && onProgress.call(xhr, e.loaded, e.total);
      };
      xhr.onerror = function (e) {
        // rej(e);
      };

      xhr.onloadend = function () {};
      xhr.upload.onprogress = function (e) {
        onProgressUpload && onProgressUpload.call(xhr, e.loaded, e.total);
      };

      xhr.open(method, `${baseUrl}${point}`);

      // type response. because this use for api thus response alway is a json
      xhr.responseType = 'json';

      // set header for request
      for (const [key, value] of headers.entries()) {
        xhr.setRequestHeader(key, value);
      }

      xhr.send(formatBody(body));
    } catch (e) {
      console.error(e);
      rej(e);
    }
  });
  // let result = await fetch(`${baseUrl}${point}`, {
  //   method,
  //   body: formatBody(body),
  //   headers: headers
  //     ? headers
  //     : {
  //         "Content-Type": "application/json",
  //       },
  // });
  // let isOk = result.ok;
  // result = await result.json();

  // if (!isOk) {
  //   return Promise.reject(result);
  // }

  // return result;
};

const createRequest = <T extends unknown>(
  point: string,
  method: IRequestMethod,
  body: IRequestBody = undefined,
  headers: Headers | undefined = defaultHeaders,
  events: IRequestEvents,
) => {
  if (typeof window !== 'undefined') {
    return createMethodXMLHttpRequest<T>(point, method, body, headers, events);
  } else {
    return createMethodFetchRequest<T>(point, method, body, headers, events);
  }
};
// type IEndPointFetch = <T extends IEndPoint>(
//   endPoint: Pickey<T, 'endPoint'>,
// options: MergeOptions<
//   Pickey<T, 'body'>,
//   {
//     body: Pickey<T, 'body'>;
//   },
//   number,
//   MergeOptions<
//     Pickey<T, 'params'>,
//     {
//       params: Pickey<T, 'params'>;
//     },
//     Pickey<T, 'paramsEndPoint'>,
//     {
//       paramsEndPoint: Pickey<T, 'paramsEndPoint'>;
//     },
//     undefined
//   >
// >,
// ) => Promise<Pickey<T, 'response'>>;
const createRequestFactory =
  (method: IRequestMethod) =>
  <T extends IEndPoint>(
    endPoint: T['endPoint'],
    options: T['options'],
  ): Promise<T['response']> => {
    const cloneObject = options as MergeOb<typeof options>;
    if (options) {
      type test = typeof options;
      type ob = MergeOb<test>;
      type test12 = ob['paramsEndPoint'];
    }

    switch (method) {
      case 'PUT':
      case 'POST':
        return createRequest(
          splitParamsEndpoint(
            endPoint,
            cloneObject && 'paramsEndPoint' in cloneObject
              ? cloneObject.paramsEndPoint
              : undefined,
          ) +
            paramToString(
              cloneObject && 'params' in cloneObject
                ? cloneObject.params
                : undefined,
            ),
          method,
          cloneObject && 'body' in cloneObject ? cloneObject.body : undefined,
          undefined,
          {},
        );
      case 'GET':
      case 'DELETE':
        return createRequest(
          splitParamsEndpoint(
            endPoint,
            cloneObject && 'paramsEndPoint' in cloneObject
              ? cloneObject.paramsEndPoint
              : undefined,
          ) +
            paramToString(
              cloneObject && 'params' in cloneObject
                ? options.params
                : undefined,
            ),
          method,
          undefined,
          undefined,
          {},
        );
    }
  };

const createRequestAuthFactory =
  (method: IRequestMethod) =>
  <T extends IEndPoint>(
    endPoint: T['endPoint'],
    options: T['options'],
  ): Promise<T['response']> => {
    const cloneObject = options as MergeOb<typeof options>;
    if (options) {
      type test = typeof options;
      type ob = MergeOb<test>;
      type test12 = ob['paramsEndPoint'];
    }

    switch (method) {
      case 'PUT':
      case 'POST':
        return createMethodAuth(
          splitParamsEndpoint(
            endPoint,
            cloneObject && 'paramsEndPoint' in cloneObject
              ? cloneObject.paramsEndPoint
              : undefined,
          ) +
            paramToString(
              cloneObject && 'params' in cloneObject
                ? cloneObject.params
                : undefined,
            ),
          method,
          cloneObject && 'body' in cloneObject ? cloneObject.body : undefined,
          undefined,
        );
      case 'GET':
      case 'DELETE':
        return createMethodAuth(
          splitParamsEndpoint(
            endPoint,
            cloneObject && 'paramsEndPoint' in cloneObject
              ? cloneObject.paramsEndPoint
              : undefined,
          ) +
            paramToString(
              cloneObject && 'params' in cloneObject
                ? options.params
                : undefined,
            ),
          method,
          undefined,
          undefined,
        );
    }
  };

const createMethodAuth = <T extends unknown>(
  point: string,
  method: IRequestMethod,
  body?: IRequestBody,
  events: IRequestEvents = {},
) =>
  createRequest<T>(
    point,
    method,
    body,
    new Headers({
      Authorization: `Bearer ${token.get()}`,
      'Content-Type': 'application/json',
    }),
    events,
  );

export const uploadfile = <T extends IEndPointUploadFile>(
  point: Pickey<T, 'endPoint'>,
  data: Pickey<T, 'body'>,
  paramsEndPoint: Pickey<T, 'paramsEndPoint'>,
  method: IRequestMethod = 'POST',
  events = {},
): Promise<Pickey<T, 'response'>> => {
  const formData = new FormData();

  for (let [name, value] of Object.entries(data)) {
    if (typeof value === 'number') {
      value = value.toString();
    }
    formData.append(name, value);
  }

  return createRequest(
    splitParamsEndpoint(point, paramsEndPoint),
    method,
    formData,
    new Headers({
      Authorization: `Bearer ${token.get()}`,
    }),
    events,
  );
};

const paramToString = (params: Record<string, string | number> | undefined) => {
  if (!params) return '';

  const urlSearch = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    urlSearch.append(key, value.toString());
  }
  return '?' + urlSearch.toString();
};

const client = {
  GET: createRequestFactory('GET'),
  POST: createRequestFactory('POST'),
  PUT: createRequestFactory('PUT'),
  DELETE: createRequestFactory('DELETE'),
};

export const clientAuth = {
  GET: createRequestAuthFactory('GET'),
  POST: createRequestAuthFactory('POST'),
  PUT: createRequestAuthFactory('PUT'),
  DELETE: createRequestAuthFactory('DELETE'),
};

export default client;

export const getMedia = (url: string) => {
  if (!url) throw new Error('url is require');
  if (isValidUrl(url)) {
    return url;
  } else {
    return `${process.env.NEXT_PUBLIC_URL_BACKEND}/${url}`;
  }
};
