import { isCurrentOrigin, isValidUrl, token } from "../functions/common";

const handleError = (error) => {
  console.error(error);
};
export const baseUrl = `${import.meta.env.VITE_URL_BACKEND}/api/v1`;
const createMethod = async (point, method, body = null, headers) => {
  const getBody = () => {
    const isObject = typeof body === "object";
    const isEmpty = !Boolean(body);
    const isFormData = body instanceof FormData;
    if (isFormData) return body;
    if (isEmpty) return undefined;
    if (isObject) return JSON.stringify(body);
    return body;
  };
  let result = await fetch(`${baseUrl}${point}`, {
    method,
    body: getBody(),
    mode: "cors",
    headers: headers
      ? headers
      : {
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

const createMethodAuth = async (point, method, body = null) =>
  await createMethod(
    point,
    method,
    body,
    new Headers({
      Authorization: `Bearer ${token.get()}`,
      "Content-Type": "application/json",
    })
  );

export const uploadfile = async (point, data) => {
  const formData = new FormData();

  for (let [name, value] of Object.entries(data)) {
    formData.append(name, value);
  }
  return await createMethod(
    point,
    "POST",
    formData,
    new Headers({
      Authorization: `Bearer ${token.get()}`,
    })
  );
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

export const getMedia = (url) => {
  if (!url) return;
  console.log(isValidUrl(url), url);
  if (isValidUrl(url)) {
    return url;
  } else {
    return `${import.meta.env.VITE_URL_BACKEND}/${url}`;
  }
};
