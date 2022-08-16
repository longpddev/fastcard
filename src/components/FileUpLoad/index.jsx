import React from "react";
import { useState } from "react";
import { useRef } from "react";
import {
  compose,
  prop,
  isNil,
  isEmpty,
  unless,
  equals,
  cond,
  always,
} from "ramda";
import { useMemo } from "react";
import useActivated from "../../hooks/useActivated";
import clsx from "clsx";
import { useEffect } from "react";

const invoke = (...callbackList) => {
  return (...agru) =>
    Array.from(callbackList).map((callback) => callback.apply(undefined, agru));
};

const getFile = (ob) => ob?.files?.[0];
const getName = compose(prop("name"), getFile);
const getSize = compose(prop("size"), getFile);
const getType = compose(prop("type"), getFile);

const typeAllow = (type) => compose((fileType) => type.test(fileType), getType);

const sizeAllow = (maxSize) =>
  compose((sizeFile) => sizeFile < maxSize, getSize);
const getSrcFile = compose(
  unless(isNil, (file) => URL.createObjectURL(file)),
  getFile
);

const validate = (maxSize, type) =>
  cond([
    [
      compose((value) => !Boolean(value), getFile),
      always("Please select image to upload"),
    ],
    [
      compose(equals(false), typeAllow(type)),
      always("Please just upload image with extension png, jpg, jpeg"),
    ],
    [
      compose(equals(false), sizeAllow(maxSize)),
      always("Please upload image less or equal 2mb"),
    ],
  ]);
const FileUpLoad = ({
  maxSize = 1024 * 1024 * 2,
  type = /^image\/.+$/,
  onChange,
  onError,
}) => {
  const file = useRef();
  const [_, rerender] = useState();
  const { isActivated, onActive } = useActivated();
  const fileValidate = useMemo(() => {
    return validate(maxSize, type)(file.current);
  }, [getFile(file.current)]);

  const isSelectedFile = compose(Boolean, getFile, always(file.current));
  const getSrcFileV2 = compose(getSrcFile, always(file.current));
  const getNameV2 = compose(getName, always(file.current));
  const removeFile = () => {
    const input = file.current;
    if (!input) return;
    input.value = "";
    rerender();
  };
  console.log(fileValidate);
  console.log(
    getName(file.current),
    getSize(file.current),
    typeAllow(type)(file.current),
    sizeAllow(maxSize)(file.current),
    getType(file.current),
    getSrcFile(file.current)
  );

  useEffect(() => {
    const fileObject = getFile(file.current);
    if (onChange) onChange(fileObject);
    if (onError) onError(fileObject, fileValidate);
  }, [getFile(file.current)]);

  return (
    <>
      <div
        className={clsx(
          "relative rounded-lg border-2 text-center flex items-center flex-col justify-center border-dashed min-h-[100px]",
          {
            "border-sky-400": !isActivated(),
            "border-green-400": isActivated() && isNil(fileValidate),
            "border-red-400": isActivated && !isNil(fileValidate),
          }
        )}
      >
        <input
          ref={file}
          type="file"
          onChange={invoke((e) => rerender({}), onActive)}
          className="absolute inset-0 block w-full h-full  bg-transparent opacity-0 cursor-pointer"
        />

        <p>
          <i className="fas fa-upload text-xl text-sky-400"></i>&nbsp;&nbsp;Drag
          and drop File here to Upload
        </p>
        <p className="text-slate-400 text-sm">
          {getNameV2() ? (
            <>
              File name:{" "}
              <span className="text-sky-400 font-medium">{getNameV2()}</span>
            </>
          ) : (
            "or Select to File to Upload"
          )}
        </p>
      </div>
      {isSelectedFile() && isNil(fileValidate) && (
        <div>
          <div className="inline-block relative group">
            <a href={getSrcFileV2()} target="_black">
              <img
                src={getSrcFileV2()}
                alt={getNameV2()}
                title={getNameV2()}
                className="max-w-[100px] shadow-black shadow-inset mt-2"
              />
            </a>
            <button
              onClick={removeFile}
              className="opacity-0 p-2 group-hover:opacity-100 absolute top-0 right-0 active:scale-90 transition-all scale-100 text-red-400"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}

      {!isNil(fileValidate) && (
        <p className="text-red-400 text-sm font-medium mt-2">{fileValidate}</p>
      )}
    </>
  );
};

export default FileUpLoad;
