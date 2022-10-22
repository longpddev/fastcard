import { TOKEN_KEY } from "../constants";
import MD5 from "crypto-js/md5";
import { curry, isNil } from "ramda";
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
    /^((blob:)|((http(s?)):\/\/))([wW]{3}\.)?[a-zA-Z0-9\-.]+\.?(\.[a-zA-Z]{2,})?.*$/g;
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
  if (data.meta.requestStatus === "rejected") {
    console.error(data);
    console.trace(data.error.stack);
    return Promise.reject(data);
  }
  return Promise.resolve(data);
};

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export function isImage64(url) {
  return /^data:image\/(jpeg|png|jpg)(;base64,).*/.test(url);
}

export function getImageBase64(url) {
  if (!isImage64(url)) return Promise.resolve(url);

  return new Promise((res, rej) => {
    const image = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    image.crossOrigin = "anonymous";
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      canvas.toBlob((file) => {
        res(URL.createObjectURL(file));
      }, "image/png");
    };

    image.onerror = (error) => {
      console.warning(error);
      res(url);
    };
    image.src = url;
  });
}

export const pickKey = curry((keys, source) =>
  keys.reduce((acc, key) => {
    acc[key] = source[key];
    return acc;
  }, {})
);

/**
 *
 * @param {string} text
 */
export const firstCapitalize = (text) =>
  text[0].toUpperCase() + text.slice(1, text.length);

export const getFileNameWithExtension = (objectFile) =>
  objectFile.fileName + "." + objectFile.extension;

export const getFileImageField = (imageOb) =>
  imageOb
    ? {
        file: new File([imageOb.file], getFileNameWithExtension(imageOb)),
        width: imageOb.width,
        height: imageOb.height,
      }
    : null;

export const runIdle = (cb) =>
  function () {
    if ("queueMicrotask" in window) {
      queueMicrotask(cb.bind(this, ...arguments));
    } else {
      setTimeout(cb.bind(this, ...arguments));
    }
  };

export const pastThen = (cb) => (result) => {
  cb(result);
  return result;
};

class Maybe {
  constructor(data) {
    if (data instanceof Maybe) {
      data = data.get();
    }

    if (!Array.isArray(data)) data = [data];
    this.data = data;
  }

  clone() {
    return new Maybe(this.get());
  }

  get() {
    return this.data.length === 1 ? this.data[0] : this.data;
  }

  isNil() {
    return isNil(this.get());
  }
  map(cb) {
    if (this.isNil()) return new Maybe(null);
    return new Maybe(this.data.map(cb));
  }
  run(cb) {
    this.map(cb);
    return this;
  }
}

export const maybe = function (data) {
  return new Maybe(data);
};

maybe.prototype.Maybe = Maybe;

export const formatByteUnit = (size) => {
  let unitSize = size;
  let unit = "byte";

  if (Math.floor(unitSize / 1024) > 1) {
    unit = "Kb";
    unitSize /= 1024;
  }

  if (Math.floor(unitSize / 1024) > 1) {
    unit = "Mb";
    unitSize /= 1024;
  }

  unitSize = Math.ceil(unitSize * 100) / 100;

  return {
    unitSize,
    unit,
    text: unitSize + " " + unit,
  };
};

export function parseProgress(cb) {
  let prevLoaded = 0,
    prevTime = new Date().getTime();
  return (loaded, total) => {
    const currentTime = new Date().getTime();
    const diff = loaded - prevLoaded;
    const percent = Math.ceil((loaded / total) * 100 * 10) / 10;
    const speed = (diff / (currentTime - prevTime)) * 1000;
    prevTime = currentTime;
    prevLoaded = loaded;

    cb({
      percent,
      loaded,
      total,
      speed,
      format: {
        loaded: formatByteUnit(loaded),
        total: formatByteUnit(total),
        speed: formatByteUnit(speed),
      },
    });
  };
}

export const checklistValidate = {
  password: [
    {
      fn: (value) => value.length > 5,
      mess: "password too short",
    },
    {
      fn: (value) =>
        [/[a-z]+/.test(value), /[0-9]+/.test(value)].every((i) => i),
      mess: "password contain numbers",
    },
  ],
  repeatPassword: (pw) => [
    {
      fn: (value) => pw === value,
      mess: "password doesn't match",
    },
  ],
};

export const getTextSelect = () => {
  return window.getSelection().toString();
};
