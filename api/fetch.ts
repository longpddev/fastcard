import { redirect } from 'next/navigation';
import {
  IRequestBase,
  IRequestBody,
  IRequestEvents,
  IRequestMethod,
} from './type';
import { formatBody } from './utilities';
import { ConnectRefuse, FetchError, Unauthorized } from 'helpers/common';
import { globalNavigate, token } from '@/functions/common';
import { ROUTER, TOKEN_KEY } from '../constants';

export const baseUrl = `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1`;

const defaultHeaders = new Headers({
  'Content-Type': 'application/json',
});

export const createMethodFetchRequest = async <T extends IRequestBase>(
  point: string,
  method: IRequestMethod,
  body: IRequestBody = undefined,
  headers: Headers | undefined = defaultHeaders,
  events: IRequestEvents,
): Promise<T> => {
  try {
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

    if (resultJson.statusCode === 401) {
      return Promise.reject(new Unauthorized('Unauthorized'));
    }

    if (!isOk) {
      return Promise.reject(new FetchError(resultJson.message, resultJson));
    }

    return resultJson;
  } catch (e) {
    throw new ConnectRefuse();
  }
};

export const createMethodXMLHttpRequest = <T extends IRequestBase>(
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
        if (xhr.status === 401) {
          rej(new Unauthorized('Unauthorized'));
          return;
        }
        if (xhr.status == 404 || xhr.status == 406 || xhr.status === 403) {
          rej(new FetchError(xhr.response.message, xhr.response));
          return;
        }

        res(xhr.response);
      };
      xhr.onprogress = function (e) {
        onProgress && onProgress.call(xhr, e.loaded, e.total);
      };
      xhr.onerror = function (e) {
        rej(new ConnectRefuse());
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
};

export const createRequest = async <T extends IRequestBase>(
  point: string,
  method: IRequestMethod,
  body: IRequestBody = undefined,
  headers: Headers | undefined = defaultHeaders,
  events: IRequestEvents,
) => {
  try {
    if (typeof window !== 'undefined') {
      return await createMethodXMLHttpRequest<T>(
        point,
        method,
        body,
        headers,
        events,
      );
    } else {
      return await createMethodFetchRequest<T>(
        point,
        method,
        body,
        headers,
        events,
      );
    }
  } catch (e) {
    if (e instanceof Unauthorized) {
      if (typeof window === 'undefined') {
        console.trace(headers);
        redirect(ROUTER.login);
      } else {
        if (globalNavigate.current) {
          globalNavigate.current.push(ROUTER.login);
        } else {
          window.open(ROUTER.login, '_self');
        }
      }
    }
    throw e;
  }
};
