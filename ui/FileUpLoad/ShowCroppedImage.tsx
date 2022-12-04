'use client';

import clsx from 'clsx';
import React, { useMemo } from 'react';
import { IBlobImage, IReactProps } from '@/interfaces/common';

const ShowCroppedImage: IReactProps<{
  fileImage: IBlobImage;
  onReset: () => void;
}> = ({ fileImage, className, onReset, ...props }) => {
  const src = useMemo(
    () => URL.createObjectURL(fileImage.file),
    [fileImage.file],
  );
  return (
    <div className={clsx(className, 'relative flex')} {...props}>
      <div className="relative mx-auto inline-block">
        <a href={src} target="_black">
          <img
            src={src}
            alt=""
            className="max-w-[400px]"
            width={fileImage.width}
            height={fileImage.height}
          />
        </a>
        <button
          title="reset"
          className="z-1 absolute top-0 right-0 inline-flex p-2"
          onClick={() => onReset()}
        >
          <i className="fas fa-xmark px-[0.288em] text-lg hover:text-red-400"></i>
        </button>
      </div>
    </div>
  );
};

export default ShowCroppedImage;
