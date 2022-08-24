import { TOKEN_KEY } from "../constants";
import MD5 from "crypto-js/md5";
export const titlePage = (title) => {
  if (document.title !== title) document.title = title;
};

export const animate = (callback) => {
  let isLoop = true;

  function loop() {
    if (isLoop && callback()) requestAnimationFrame(loop);
  }

  loop();
  return () => (isLoop = false);
};

export const isValidUrl = (url) => {
  const urlRegex =
    /^(blob:)?((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?.*$/g;
  const result = url.match(urlRegex);

  return result !== null;
};

export const isCurrentOrigin = (url) => {
  const obUrl = new URL(url);
  return location.origin === obUrl.origin;
};

export const runAsAsync = (callback) => {
  if (!window.queueMicrotask) {
    setTimeout(callback, 0);
    return;
  }
  queueMicrotask(callback);
};

export const delay = (time) => {
  return (...argus) => {
    return new Promise((res) => {
      setTimeout(() => {
        res(...argus);
        console.log(time);
      }, time);
    });
  };
};

export const run = (callback) => callback();

export const encodePassword = (password) => MD5(password).toString();
export const token = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  reset: () => token.set(""),
};

export const watchThunk = (data) => {
  if (data.meta.requestStatus === "rejected") return Promise.reject(data);
  return Promise.resolve(data);
};
