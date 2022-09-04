import React from "react";
import { useState } from "react";

import InputFile from "./InputFile";
import ShowCroppedImage from "./ShowCroppedImage";

const FileUpLoad = ({
  croppedImage,
  imageUrl,
  setImageUrl,
  setCroppedImage,
}) => {
  return (
    <>
      {!croppedImage && (
        <InputFile
          imageUrl={imageUrl}
          croppedImage={croppedImage}
          setCroppedImage={setCroppedImage}
        />
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
