'use client';

import React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { compose, isNil, always } from 'ramda';
import { useMemo } from 'react';
import useActivated from '../../hooks/useActivated';
import clsx from 'clsx';
import { useEffect } from 'react';
import { getFile, getName, validate } from './functions';
import GetImageFromInternet from './GetImageFromInternet';
import PopupCrop from '../PopupCrop';
import { pushToast } from '../Toast';
import { getImageBase64 } from '@/functions/common';
import { IReactProps, ICroppedImage } from '@/interfaces/common';
const InputFile: IReactProps<{
  maxSize?: number;
  type?: RegExp;
  onChange?: (f: File) => void;
  imageUrl: string;
  setCroppedImage: (v: ICroppedImage) => void;
  onError?: (f: File, e: string) => void;
}> = ({
  maxSize = 1024 * 1024 * 2,
  type = /^image\/.+$/,
  onChange,
  imageUrl,
  onError,
  setCroppedImage,
}) => {
  const file = useRef<HTMLInputElement>(null);
  const [_, rerender] = useState({});
  const [open, setOpen] = useState(false);
  const { isActivated, onActive } = useActivated();
  const [url, setUrl] = useState('');

  const fileValidate = useMemo(
    () => file.current && validate(maxSize, type)(file.current),
    [file.current && getFile(file.current)],
  );

  useEffect(() => {
    if (!isActivated()) return;
    if (!file.current) return;

    if (fileValidate) {
      pushToast.warning(fileValidate);
      return;
    }

    const getUrl = URL.createObjectURL(getFile(file.current));
    setUrl(getUrl);
    setOpen(true);
  }, [fileValidate]);

  useEffect(() => {
    if (!imageUrl) return;
    if (Boolean(url)) return;

    getImageBase64(imageUrl).then((url) => {
      setUrl(url);
      setOpen(true);
    });
  }, [imageUrl]);

  useEffect(() => {
    if (!file.current) return;
    if (!fileValidate) return;
    const fileObject = getFile(file.current);
    if (onChange) onChange(fileObject);
    if (onError) onError(fileObject, fileValidate);
  }, [file.current && getFile(file.current)]);

  return (
    <>
      <div
        className={clsx(
          'relative flex min-h-[150px] flex-col items-center justify-center rounded-lg border-2 border-dashed text-center',
          {
            'border-sky-400': !isActivated(),
            'border-green-400': isActivated() && isNil(fileValidate),
            'border-red-400': isActivated() && !isNil(fileValidate),
          },
        )}
      >
        <input
          ref={file}
          type="file"
          onChange={() => {
            rerender({});
            onActive();
          }}
          title="chose file"
          className="input absolute inset-0 block h-full  w-full cursor-pointer bg-transparent opacity-0"
        />

        <p>
          <i className="fas fa-upload text-xl text-sky-400"></i>
          &nbsp;&nbsp;Drag and drop File here to Upload
        </p>
        <GetImageFromInternet
          setUrl={(url) => {
            setUrl(url);
            setOpen(true);
          }}
        />
      </div>

      <PopupCrop
        open={open}
        setCroppedImage={(result) => {
          if (!file.current) return;
          const fileOb = getFile(file.current);
          setCroppedImage({
            ...result,
            fileName: fileOb
              ? fileOb.name.replace(/\.[a-z]+$/, '')
              : Math.random().toString(32).slice(2, 7),
            extension: 'png',
          });
        }}
        setOpen={(status) => {
          setOpen(status);

          if (status === false) {
            setUrl('');
          }
        }}
        url={url}
      />
      {isActivated() && !isNil(fileValidate) && (
        <p className="mt-2 text-sm font-medium text-red-400">{fileValidate}</p>
      )}
    </>
  );
};

export default InputFile;