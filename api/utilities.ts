import { IRequestBody } from './type';

export const paramToString = (
  params: Record<string, string | number> | undefined,
) => {
  if (!params) return '';

  const urlSearch = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    urlSearch.append(key, value.toString());
  }
  return '?' + urlSearch.toString();
};

export const formatBody = (body?: IRequestBody) => {
  const isObject = body instanceof Object;
  const isEmpty = !Boolean(body);
  if (typeof window !== 'undefined') {
    if (body instanceof FormData) return body;
  }
  // const isFormData = body instanceof FormData;
  // if (isFormData) return body;
  if (isEmpty) return undefined;
  if (isObject) return JSON.stringify(body);
  return body;
};
