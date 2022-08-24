import React from "react";
import { useState } from "react";

import InputFile from "./InputFile";
import ShowCroppedImage from "./ShowCroppedImage";

const FileUpLoad = ({ croppedImage, setCroppedImage }) => {
  return (
    <>
      {!croppedImage && (
        <InputFile
          croppedImage={croppedImage}
          setCroppedImage={setCroppedImage}
        />
      )}

      {croppedImage && (
        <ShowCroppedImage
          fileImage={croppedImage}
          onReset={() => setCroppedImage(null)}
        />
      )}
    </>
  );
};

export default FileUpLoad;
