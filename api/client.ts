import { isValidUrl, splitParamsEndpoint, token } from '../functions/common';
import { paramToString } from './utilities';
import {
  IEndPoint,
  IEndPointUploadFile,
  IRequestBase,
  IRequestBody,
  IRequestEvents,
  IRequestMethod,
  MergeOb,
  Pickey,
} from './type';
import { createRequest } from './fetch';

const createRequestFactory =
  (method: IRequestMethod) =>
  <T extends IEndPoint>(
    endPoint: T['endPoint'],
    options: T['options'],
  ): Promise<T['response']> => {
    const cloneObject = options as MergeOb<typeof options>;

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

const createMethodAuth = <T extends IRequestBase>(
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
  // if (!url) throw new Error('url is require');
  if (!url) return;
  if (isValidUrl(url)) {
    return url;
  } else {
    return `${process.env.NEXT_PUBLIC_URL_BACKEND}/${url}`;
  }
};
