'use client';

import { count, curry } from 'ramda';
import { useEffect, useState } from 'react';
import { runAsAsync } from '@/functions/common';

export const TYPE: {
  error: 'error';
  success: 'success';
  warning: 'warning';
  info: 'info';
  loading: 'loading';
} = {
  error: 'error',
  success: 'success',
  warning: 'warning',
  info: 'info',
  loading: 'loading',
};

interface IItemToast {
  message: string;
  type: keyof typeof TYPE;
  id: number;
  count_down: number;
}

type IItemSubscribe = (v: Array<IItemToast>) => void;

export const COUNT_DOWN = 6000;

let idToast = 0;
const toastMap = new Map<IItemToast, IItemToast>();
const subscribeMap = new Map<IItemSubscribe, IItemSubscribe>();
function mapToArray(map: Map<IItemToast, IItemToast>) {
  let result: Array<IItemToast> = new Array();
  for (let [key, value] of map.entries()) {
    result.push(value);
  }

  return result;
}
const notifyToast = () => {
  runAsAsync(() => {
    for (let [callback] of subscribeMap.entries()) {
      callback(mapToArray(toastMap));
    }
  });
};

export const subscribeToast = (callback: IItemSubscribe) => {
  subscribeMap.set(callback, callback);

  // unsubscribe function
  return () => {
    subscribeMap.delete(callback);
  };
};

/**
 * message: {message, time} | string
 */
const createToast = curry((type, message): (() => void) => {
  if (!(type in TYPE)) throw new Error(`type: ${type} doesn't exits`);
  let count_down = COUNT_DOWN;
  let mess = message;
  if (typeof message === 'object') {
    count_down = message.time || count_down;
    mess = message.message;
  }
  idToast++;
  const itemToast: IItemToast = {
    message: mess,
    type,
    id: idToast,
    count_down,
  };

  toastMap.set(itemToast, itemToast);
  notifyToast();
  // delete toast callback
  return () => {
    toastMap.delete(itemToast);
    notifyToast();
  };
});

export const removeToast = (toastItem: IItemToast) => {
  toastMap.delete(toastItem);
  notifyToast();
};

export const useSubscribeToast = () => {
  const [toast, setToast] = useState({});
  useEffect(() => subscribeToast(() => setToast({})), []);

  return { toast, removeToast, pushToast };
};

export const pushToast = {
  [TYPE.error]: createToast(TYPE.error),
  [TYPE.info]: createToast(TYPE.info),
  [TYPE.warning]: createToast(TYPE.warning),
  [TYPE.success]: createToast(TYPE.success),
  [TYPE.loading]: createToast(TYPE.loading),
};

export const pushFastToast = {
  [TYPE.error]: (message: string) =>
    createToast(TYPE.error, { message, time: 2000 }),
  [TYPE.info]: (message: string) =>
    createToast(TYPE.info, { message, time: 2000 }),
  [TYPE.warning]: (message: string) =>
    createToast(TYPE.warning, { message, time: 2000 }),
  [TYPE.success]: (message: string) =>
    createToast(TYPE.success, { message, time: 2000 }),
  [TYPE.loading]: (message: string) =>
    createToast(TYPE.loading, { message, time: 2000 }),
};
