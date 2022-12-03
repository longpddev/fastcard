'use client';

import {
  compose,
  prop,
  isNil,
  isEmpty,
  unless,
  equals,
  cond,
  always,
} from 'ramda';

export const invoke = (...callbackList) => {
  return (...agru) =>
    Array.from(callbackList).map((callback) => callback.apply(undefined, agru));
};

export const getFile = (ob) => ob?.files?.[0];
export const getName = compose(prop('name'), getFile);
export const getSize = compose(prop('size'), getFile);
export const getType = compose(prop('type'), getFile);

const typeAllow = (type) => compose((fileType) => type.test(fileType), getType);

export const sizeAllow = (maxSize) =>
  compose((sizeFile) => sizeFile < maxSize, getSize);
export const getSrcFile = compose(
  unless(isNil, (file) => URL.createObjectURL(file)),
  getFile,
);

export const validate = (maxSize, type) =>
  cond([
    [
      compose((value) => !Boolean(value), getFile),
      always('Please select image to upload'),
    ],
    [
      compose(equals(false), typeAllow(type)),
      always('Please just upload image with extension png, jpg, jpeg'),
    ],
    [
      compose(equals(false), sizeAllow(maxSize)),
      always('Please upload image less or equal 2mb'),
    ],
  ]);
