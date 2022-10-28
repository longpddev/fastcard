import { isCurrentOrigin, isValidUrl, token } from "../functions/common";

const handleError = (error) => {
  console.error(error);
};

const defaultHeaders = new Headers({
  "Content-Type": "application/json",
});

const formatBody = (body) => {
  const isObject = typeof body === "object";
  const isEmpty = !Boolean(body);
  const isFormData = body instanceof FormData;
  if (isFormData) return body;
  if (isEmpty) return undefined;
  if (isObject) return JSON.stringify(body);
  return body;
};

export const baseUrl = `${import.meta.env.VITE_URL_BACKEND}/api/v1`;
// const createMethod = async (point, method, body = null, headers) => {
//   let result = await fetch(`${baseUrl}${point}`, {
//     method,
//     body: formatBody(body),
//     headers: headers
//       ? headers
//       : {
//           "Content-Type": "application/json",
//         },
//   });
//   let isOk = result.ok;
//   result = await result.json();

//   if (!isOk) {
//     return Promise.reject(result);
//   }

//   return result;
// };

/**
 *
 * @param {string} point
 * @param {GET | POST | PUT | DELETE} method
 * @param {string | FormData | undefined } body
 * @param { Headers } headers
 * @param { (loaded: number, total: number)  => void} onProgress
 * @return { Promise<any> }
 */
const createMethodXMLHttpRequest = (
  point,
  method,
  body = null,
  headers = defaultHeaders,
  { onProgress, onProgressUpload }
) => {
  return new Promise((res, rej) => {
    try {
      const xhr = new XMLHttpRequest();
      // cos origin
      xhr.withCredentials = false;

      if (!(headers instanceof Headers))
        throw new Error("header must is instanceof Headers");

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
      xhr.responseType = "json";

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

const createMethodAuth = (point, method, body = null, events = {}) =>
  createMethodXMLHttpRequest(
    point,
    method,
    body,
    new Headers({
      Authorization: `Bearer ${token.get()}`,
      "Content-Type": "application/json",
    }),
    events
  );

export const uploadfile = (point, data, method = "POST", events = {}) => {
  const formData = new FormData();

  for (let [name, value] of Object.entries(data)) {
    formData.append(name, value);
  }
  return createMethodXMLHttpRequest(
    point,
    method,
    formData,
    new Headers({
      Authorization: `Bearer ${token.get()}`,
    }),
    events
  );
};

const paramToString = (params) => {
  if (!params) return "";

  return "?" + new URLSearchParams(params).toString();
};

const client = {
  GET: (point, options = {}) =>
    createMethodXMLHttpRequest(
      point + paramToString(options.params),
      "GET",
      undefined,
      undefined,
      {}
    ),
  POST: (point, options = {}) =>
    createMethodXMLHttpRequest(
      point + paramToString(options.params),
      "POST",
      options.body,
      undefined,
      {}
    ),
  PUT: (point, options = {}) =>
    createMethodXMLHttpRequest(
      point + paramToString(options.params),
      "PUT",
      options.body,
      undefined,
      {}
    ),
  DELETE: (point, options = {}) =>
    createMethodXMLHttpRequest(
      point + paramToString(options.params),
      "DELETE",
      undefined,
      undefined,
      {}
    ),
};

export const clientAuth = {
  GET: (point, options = {}) =>
    createMethodAuth(point + paramToString(options.params), "GET"),
  POST: (point, options = {}) =>
    createMethodAuth(
      point + paramToString(options.params),
      "POST",
      options.body
    ),
  PUT: (point, options = {}) =>
    createMethodAuth(
      point + paramToString(options.params),
      "PUT",
      options.body
    ),
  DELETE: (point, options = {}) =>
    createMethodAuth(point + paramToString(options.params), "DELETE"),
};

export default client;

export const getMedia = (url) => {
  if (!url) return;
  if (isValidUrl(url)) {
    return url;
  } else {
    return `${import.meta.env.VITE_URL_BACKEND}/${url}`;
  }
};
