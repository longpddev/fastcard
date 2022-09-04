import { count, curry } from "ramda";
import { useEffect, useState } from "react";
import { runAsAsync } from "../../functions/common";

export const TYPE = {
  error: "error",
  success: "success",
  warning: "warning",
  info: "info",
  loading: "loading",
};
export const COUNT_DOWN = 6000;

let idToast = 0;
const toastMap = new Map();
const subscribeMap = new Map();
function mapToArray(map) {
  let result = new Array();
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

export const subscribeToast = (callback) => {
  subscribeMap.set(callback, callback);

  // unsubscribe function
  return () => subscribeMap.delete(callback);
};

/**
 * message: {message, time} | string
 */
const createToast = curry((type, message) => {
  if (!(type in TYPE)) throw new Error(`type: ${type} doesn't exits`);
  let count_down = COUNT_DOWN;
  let mess = message;
  if (typeof message === "object") {
    count_down = message.time || count_down;
    mess = message.message;
  }
  idToast++;
  const itemToast = {
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

export const removeToast = (toastItem) => {
  toastMap.delete(toastItem);
  notifyToast();
};

export const useSubscribeToast = () => {
  const [toast, setToast] = useState([]);
  useEffect(() => {
    const unsubscribe = subscribeToast(setToast);
    return () => {
      unsubscribe();
    };
  }, []);

  return { toast, removeToast, pushToast };
};

export const pushToast = {};
export const pushFastToast = {};

Object.keys(TYPE).forEach((key) => {
  const value = TYPE[key];
  pushToast[key] = createToast(value);
  pushFastToast[key] = (message) =>
    createToast(value, {
      message,
      time: 2000,
    });
});
