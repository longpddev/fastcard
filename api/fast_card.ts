type IMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
import { NextApiRequest } from 'next';

const BASE_URL = 'http://localhost:6969';

const CONTENT_TYPE = {
  json: 'application/json',
  from: 'application/x-www-form-urlencoded',
};
const HEADER_DEFAULT = {
  'Content-Type': CONTENT_TYPE.json,
};

const creator = {
  GET:
    (endpoint: string, headers: Record<string, string> = HEADER_DEFAULT) =>
    () => ({
      headers,
      url: BASE_URL + endpoint,
      method: 'GET',
    }),
  POST:
    (endpoint: string, headers: Record<string, string> = HEADER_DEFAULT) =>
    (body: Record<string, any>) => ({
      headers,
      url: BASE_URL + endpoint,
      method: 'POST',
    }),
  DELETE:
    (endpoint: string, headers: Record<string, string> = HEADER_DEFAULT) =>
    () => ({
      headers,
      url: BASE_URL + endpoint,
      method: 'DELETE',
    }),
};

// const END_POINT_AUTH = mergeOb(creator('signup', '/auth/signup', 'GET'));
const END_POINT_AUTH = {
  signup: {},
};
const END_POINT_AUTH_USER_INFO = {};
const END_POINT_IMAGE = {};
const END_POINT_GROUP_CARD = {};
const END_POINT_CARD = {};
const END_POINT_CARD_LEARN_TODAY = {};
const END_POINT_VIDEO = {};
const END_POINT_VIDEO_CHANGE_VIDEO = {};
const END_POINT_FILE_TEMP = {};

const fetchCardOptionsDefault = {
  headers: {
    'Content-Type': 'application/json',
  },
};
interface IFetchCardOptions {
  endPoint: string;
}
export const forwardToFastCard = async (
  options: IFetchCardOptions,
  res: NextApiRequest,
) => {
  const contentType = res.headers['content-type'];
  const authorization = res.headers.authorization;
  const method = res.method;
  const body = res.body;
  if (!contentType) throw new Error('request miss content type' + contentType);
  if (!method) throw new Error('request miss method');
  const headers = new Headers();
  headers.append('Content-Type', contentType);

  if (authorization) {
    headers.append('Authorization', authorization);
  }

  const result = await fetch(BASE_URL + options.endPoint, {
    method: method,
    headers: headers,
    body: JSON.stringify(body),
  });

  const resultJson = await result.json();
  return resultJson;
};
