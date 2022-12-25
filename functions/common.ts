import { TOKEN_KEY } from '../constants';
import MD5 from 'crypto-js/md5';
import { curry, isNil } from 'ramda';
import { KEY_NAME, SPECIAL_KEY } from '@/constants/index';
import { PayloadAction } from '@reduxjs/toolkit';
import { IBlobImage, ICroppedImage } from '@/interfaces/common';
import { getCookie, setCookie, removeCookies } from 'cookies-next';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
export const titlePage = (title: string) => {
  if (document.title !== title) document.title = title;
};

export const animate = (callback: () => boolean) => {
  let isLoop = true;

  function loop() {
    if (isLoop && callback()) requestAnimationFrame(loop);
  }

  loop();
  return () => {
    isLoop = false;
  };
};

export const isValidUrl = (url: string) => {
  const urlRegex =
    /^((blob:)|((http(s?)):\/\/))([wW]{3}\.)?[a-zA-Z0-9\-.]+\.?(\.[a-zA-Z]{2,})?.*$/g;
  const result = url.match(urlRegex);

  return result !== null;
};

export const isCurrentOrigin = (url: string) => {
  const obUrl = new URL(url);
  return location.origin === obUrl.origin;
};

export const runAsAsync = (callback: () => void) => {
  if (!window.queueMicrotask) {
    setTimeout(callback, 0);
    return;
  }
  queueMicrotask(callback);
};

export const delay = (time: number) => {
  return function () {
    const args = arguments;
    return new Promise((res) => {
      setTimeout(() => {
        res.apply<any, Array<any>, void>(undefined, Array.from(args));
      }, time);
    });
  };
};

export const run = <T extends (...args: any) => any>(
  callback: T,
): ReturnType<T> => callback();

export const encodePassword = (password: string) => MD5(password).toString();

// TOKEN_VALUE used both server and client side,
// the way initial TOKEN_VALUE is different,
// in server we use cookie function of nextjs and use top or root component (like layout) for set initial TOKEN_VALUE
// but in client we can't use that way, we use cookie client function to get token and initial TOKEN_VALUE
const TOKEN_VALUE = {
  value: getCookie(TOKEN_KEY) || '',
};
export const token = {
  get: () => TOKEN_VALUE.value,
  set: (token: string) => {
    setCookie(TOKEN_KEY, token);
    TOKEN_VALUE.value = token;
  },
  reset: () => {
    removeCookies(TOKEN_KEY);
    TOKEN_VALUE.value = '';
  },
};

interface IWatchThunk {
  meta: {
    requestStatus: unknown;
  };
  error?: {
    stack?: string;
  };
}

export const watchThunk = <T extends IWatchThunk>(data: T): Promise<T> => {
  if (data.meta.requestStatus === 'rejected') {
    console.error(data);
    console.trace(data?.error?.stack);
    return Promise.reject(data);
  }
  return Promise.resolve(data);
};

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export function isImage64(url: string) {
  return /^data:image\/(jpeg|png|jpg)(;base64,).*/.test(url);
}

export function getImageBase64(url: string): Promise<string> {
  if (!isImage64(url)) return Promise.resolve(url);

  return new Promise((res, rej) => {
    const image = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('get context in canvas fail');
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      canvas.toBlob((file) => {
        if (!file) throw new Error('create blob in canvas fail');
        res(URL.createObjectURL(file));
      }, 'image/png');
    };

    image.onerror = (error) => {
      console.warn(error);
      res(url);
    };
    image.src = url;
  });
}

export const pickKey = curry(
  (keys: Array<string>, source: Record<string, any>) =>
    keys.reduce((acc, key) => {
      acc[key] = source[key];
      return acc;
    }, {} as Record<string, string>),
);

/**
 *
 * @param {string} text
 */
export const firstCapitalize = (text: string) => {
  if (!text) return text;
  return text[0].toUpperCase() + text.slice(1, text.length);
};

export const getFileNameWithExtension = (objectFile: ICroppedImage) =>
  objectFile.fileName + '.' + objectFile.extension;

export const getFileImageField = (imageOb?: ICroppedImage) =>
  imageOb
    ? {
        file: new File([imageOb.file], getFileNameWithExtension(imageOb)),
        width: imageOb.width,
        height: imageOb.height,
      }
    : undefined;

export function runIdle<T extends (...argus: any) => void>(
  cb: T,
  context?: any,
): T {
  return function (...argus) {
    if ('queueMicrotask' in window) {
      queueMicrotask(cb.bind(context, ...argus));
    } else {
      setTimeout(cb.bind(context, ...argus));
    }
  } as T;
}

export const pastThen = (cb: (v: any) => void) => (result: any) => {
  cb(result);
  return result;
};

type IMaybeInitData = any;

class Maybe {
  data: Array<any>;
  constructor(data: IMaybeInitData) {
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
  map(cb: (v: any) => typeof v) {
    if (this.isNil()) return new Maybe(null);
    return new Maybe(this.data.map(cb));
  }
  run(cb: (v: any) => typeof v) {
    this.map(cb);
    return this;
  }
}

export const maybe = function (data: IMaybeInitData) {
  return new Maybe(data);
};

maybe.prototype.Maybe = Maybe;

interface IFormatByteUnit {
  unitSize: number;
  unit: string;
  text: string;
}
export const formatByteUnit = (size: number): IFormatByteUnit => {
  let unitSize = size;
  let unit = 'byte';

  if (Math.floor(unitSize / 1024) > 1) {
    unit = 'Kb';
    unitSize /= 1024;
  }

  if (Math.floor(unitSize / 1024) > 1) {
    unit = 'Mb';
    unitSize /= 1024;
  }

  unitSize = Math.ceil(unitSize * 100) / 100;

  return {
    unitSize,
    unit,
    text: unitSize + ' ' + unit,
  };
};

type IParseProgressCallback = (v: {
  percent: number;
  loaded: number;
  total: number;
  speed: number;
  format: {
    loaded: IFormatByteUnit;
    total: IFormatByteUnit;
    speed: IFormatByteUnit;
  };
}) => void;
export function parseProgress(cb: IParseProgressCallback) {
  let prevLoaded = 0,
    prevTime = new Date().getTime();

  return (loaded: number, total: number) => {
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
      fn: (value: string) => value.length > 5,
      mess: 'password too short',
    },
    {
      fn: (value: string) =>
        [/[a-z]+/.test(value), /[0-9]+/.test(value)].every((i) => i),
      mess: 'password contain numbers',
    },
  ],
  repeatPassword: (pw: string) => [
    {
      fn: (value: string) => pw === value,
      mess: "password doesn't match",
    },
  ],
};

export const getTextSelect = () => {
  const selection = window.getSelection();
  if (!selection)
    throw new Error('browser don\t support function getSelection');
  return selection.toString();
};

export const uuid = () => Math.random().toString(32).slice(2);

export const parseStringToArr = (str: string, parseBy = /\[[^\]]*\]/gm) => {
  let start = 0;
  const arr = [];
  str.replace(parseBy, (match, offset, string) => {
    const end = offset + match.length;
    if (offset !== start) {
      arr.push({
        start,
        end: offset,
        isMatch: false,
      });
    }
    arr.push({
      start: offset,
      end,
      isMatch: true,
    });
    start = end;

    return string;
  });

  if (start < str.length - 1) {
    arr.push({
      start: start,
      end: str.length - 1,
      isMatch: false,
    });
  }

  return arr.map(({ start, end, isMatch }) => {
    return {
      text: str.slice(start, end),
      isMatch,
    };
  });
};

export const extractNameShortCut = (name: string) => {
  const [keyName, specialKey] = name.split(';').reverse();
  return {
    keyName,
    specialKey: specialKey ? specialKey + ';' : undefined,
  };
};

/**
 *
 * @param { File } file
 * @param { number } size default 10mb
 * @param { File[] }
 */
export const sliceFile = (file: File, size = 10241440) => {
  let totalSize = file.size;
  let current = 0;
  const type = file.type;
  const fileName = file.name;
  const files = [];
  while (current < totalSize) {
    files.push(
      new File(
        [file.slice(current, Math.min(current + size, totalSize))],
        fileName,
        {
          type,
        },
      ),
    );
    current += size;
  }

  return files;
};
/**
 * @param { () => never | never} getValue
 * @param { undefined | string | number } key
 * @returns
 */
export const getSet =
  (getValue: () => any | any, key: string) => (val: any) => {
    const getValueResult =
      typeof getValue === 'function' ? getValue() : getValue;

    if (val !== undefined) {
      // we can able to reassign property in site the object or array.
      return key !== undefined
        ? (getValueResult[key] = val)
        : /** we just return the value and can't change any thing */ val;
    } else {
      return getValueResult;
    }
  };

/**
 *
 * @param { Event } event
 * @param { string } shortCutName
 * @returns { boolean }
 */
export function matchShortCut(
  event: KeyboardEvent | React.KeyboardEvent<HTMLInputElement>,
  shortCutName: string,
) {
  const { keyName, specialKey } = extractNameShortCut(shortCutName);
  if (specialKey) {
    switch (specialKey) {
      case SPECIAL_KEY.Command:
        if (!event.metaKey) return false;
        break;
      case SPECIAL_KEY.Alt:
        if (!event.altKey) return false;
        break;
      case SPECIAL_KEY.Ctrl:
        if (!event.ctrlKey) return false;
        break;
      case SPECIAL_KEY.Shift:
        if (!event.shiftKey) return false;
        break;
    }
  } else {
    if (event.metaKey) return false;
    if (event.altKey) return false;
    if (event.ctrlKey) return false;
  }

  if (keyName !== event.key) return false;

  return true;
}

/**
 * splitParamsEndpoint depend REGEX_URL_PARAM, because of that we can't move REGEX_URL_PARAM to constant file.
 * Why?, because when REGEX_URL_PARAM change the function splitParamsEndpoint is not work correct
 */
export const REGEX_URL_PARAM = /:[a-zA-Z0-9]*/g;

export function splitParamsEndpoint(
  endPoint: string,
  params: Record<string, string | number> | undefined,
) {
  // Because we match global then result will be array or null.
  const match = endPoint.match(REGEX_URL_PARAM) as Array<string> | null;

  const _params = params || {};
  if (!match) return endPoint;

  match.map((item) => {
    const param = item.replace(':', '');
    if (!(param in _params))
      throw Error(`endPoint: ${endPoint} missed param ${param}`);
    endPoint = endPoint.replace(item, _params[param].toString());
  });

  return endPoint;
}

export const globalNavigate: {
  current: undefined | AppRouterInstance;
} = {
  current: undefined,
};
