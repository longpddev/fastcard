'use client';

import React from 'react';
import { useState } from 'react';

import InputFile from './InputFile';
import ShowCroppedImage from './ShowCroppedImage';
import { IBlobImage, ICroppedImage, IReactProps } from '@/interfaces/common';
const FileUpLoad: IReactProps<{
  croppedImage: ICroppedImage;
  imageUrl: string;
  setImageUrl: (v: string | undefined) => void;
  setCroppedImage: (v: ICroppedImage | null) => void;
}> = ({ croppedImage, imageUrl, setImageUrl, setCroppedImage }) => {
  return (
    <>
      {!croppedImage && (
        <InputFile imageUrl={imageUrl} setCroppedImage={setCroppedImage} />
      )}

      {croppedImage && (
        <ShowCroppedImage
          fileImage={croppedImage}
          onReset={() => {
            setCroppedImage(null);
            setImageUrl && setImageUrl(undefined);
          }}
        />
      )}
    </>
  );
};

export default FileUpLoad;
