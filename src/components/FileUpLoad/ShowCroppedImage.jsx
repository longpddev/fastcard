import clsx from "clsx";
import React, { useMemo } from "react";

const ShowCroppedImage = ({ fileImage, className, onReset, ...props }) => {
  const src = useMemo(
    () => URL.createObjectURL(fileImage.file),
    [fileImage.file]
  );
  return (
    <div className={clsx(className, "relative flex")} {...props}>
      <div className="inline-block relative mx-auto">
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
          className="p-2 inline-flex absolute top-0 right-0 z-1"
          onClick={() => onReset()}
        >
          <i className="fas fa-xmark px-[0.288em] text-lg hover:text-red-400"></i>
        </button>
      </div>
    </div>
  );
};

export default ShowCroppedImage;
