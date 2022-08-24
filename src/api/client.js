import { token } from "../functions/common";

const handleError = (error) => {
  console.error(error);
};
export const baseUrl = `${import.meta.env.VITE_URL_BACKEND}/api/v1`;
const createMethod = async (point, method, body = null) => {
  let result = await fetch(`${baseUrl}${point}`, {
    method,
    body: body ? JSON.stringify(body) : body,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let isOk = result.ok;
  result = await result.json();

  if (!isOk) {
    return Promise.reject(result);
  }

  return result;
};

const createMethodAuth = async (point, method, body = null) => {
  let result = await fetch(`${baseUrl}${point}`, {
    method,
    body: body ? JSON.stringify(body) : body,
    mode: "cors",
    headers: new Headers({
      Authorization: `Bearer ${token.get()}`,
      "Content-Type": "application/json",
    }),
  });
  let isOk = result.ok;
  result = await result.json();

  if (!isOk) {
    console.error(result);
    return Promise.reject(result);
  }

  return result;
};

const paramToString = (params) => {
  if (!params) return "";

  return "?" + new URLSearchParams(params).toString();
};

const client = {
  GET: (point, options = {}) =>
    createMethod(point + paramToString(options.params), "GET"),
  POST: (point, options = {}) =>
    createMethod(point + paramToString(options.params), "POST", options.body),
  PUT: (point, options = {}) =>
    createMethod(point + paramToString(options.params), "PUT", options.body),
  DELETE: (point, options = {}) =>
    createMethod(point + paramToString(options.params), "DELETE"),
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

export const getMedia = (url) => `${import.meta.env.VITE_URL_BACKEND}/${url}`;
