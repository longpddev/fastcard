import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { pushToast } from "@components/Toast";
import { formatByteUnit } from "@/functions/common";

const FieldVideo = ({
  value,
  valueSet,
  thumbnail,
  thumbnailSet,
  hasValue,
  urlDemo,
}) => {
  return (
    <div>
      {!hasValue && (
        <FieldFileUi
          value={value}
          valueSet={valueSet}
          accept={"video/*"}
          size={1024 * 1024 * 200}
        />
      )}

      {hasValue && (
        <div className="block-up rounded-md p-4 mb-4">
          <PreviewVideo
            src={urlDemo}
            onRemove={() => {
              valueSet([]);
              thumbnailSet("");
            }}
            thumbnail={thumbnail}
            thumbnailSet={thumbnailSet}
          />
        </div>
      )}
    </div>
  );
};

const PreviewVideo = ({ src, onRemove, thumbnail, thumbnailSet }) => {
  const [loaded, loadedSet] = useState(false);
  const ref = useRef();
  async function getThumbnailVideo(videoEl) {
    const canvas = document.createElement("canvas");
    const { videoWidth, videoHeight } = videoEl;
    console.dir(videoEl);

    canvas.width = 400;
    canvas.height = Math.floor(((400 * videoHeight) / videoWidth) * 10) / 10;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      videoEl,
      0,
      0,
      videoWidth,
      videoHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return canvas.toDataURL();
  }

  return (
    <div className="relative max-w-[600px] mx-auto">
      <video src={src} ref={ref} controls className=""></video>
      <div className="absolute z-10 top-1 right-4 drop-shadow-[0_0_4px_black]">
        <button
          onClick={onRemove}
          className="p-2 hover:text-orange-400 relative w-6 h-6 icon-center-button"
        >
          <i className="fas fa-xmark text-xl"></i>
        </button>
        <button
          onClick={() =>
            getThumbnailVideo(ref.current).then((linkImage) => {
              thumbnailSet(linkImage);
              pushToast.success(`Create thumbnail success ![link](${linkImage} "Preview")
              `);
            })
          }
          className="p-2 ml-2 hover:text-orange-400 relative w-6 h-6 icon-center-button"
        >
          <i className="fa-solid fa-photo-film text-xl"></i>
        </button>
      </div>
      {thumbnail && (
        <ImagePreviewVideoAnimate
          key={thumbnail}
          src={thumbnail}
          className="absolute inset-0 w-full h-full block pointer-events-none transition-all opacity-100 scale-100"
          alt=""
        />
      )}

      {!thumbnail && (
        <p className="mt-2">
          <span className="text-orange-400">Notice:</span> click icon to create
          thumbnail for video
        </p>
      )}
    </div>
  );
};

const ImagePreviewVideoAnimate = (props) => {
  const [hide, hideSet] = useState(false);

  useEffect(() => {
    hideSet(true);
  }, []);
  return (
    <img
      {...props}
      style={{
        opacity: hide ? 0 : "",
        transform: hide ? "scale(1.2)" : "",
      }}
    />
  );
};

const FieldFileUi = ({ value, valueSet, remove, accept, size, ...props }) => {
  const handleChange = ({ target: { files } }) => {
    const regex = new RegExp(accept.replace("*", ".*"));
    const checkFile = (file) => {
      let result = regex.test(file.type);
      if (!result) {
        const fileName =
          file.name.length > 20 ? file.name.slice(0, 20) + "..." : file.name;
        pushToast.error(
          `File: ${fileName} with type: ${file.type}. Which don\'t except please pick another.`
        );
      }
      result = file.size <= size;

      if (!result) {
        pushToast.error(
          `${formatByteUnit(file.size).text} > ${
            formatByteUnit(size).text
          } that size limit for upload. Please choose file size lower.`
        );
      }
      return result;
    };
    const validate = [...files].every(checkFile);

    if (validate) {
      valueSet([...files]);
    }
  };
  return (
    <div className="relative min-h-[200px] w-full">
      <input
        type="file"
        title=""
        className="absolute inset-0 w-full h-full opacity-0 z-10 block cursor-pointer"
        accept={accept}
        onChange={handleChange}
        {...props}
      />
      <div className="border-2 border-dashed text-center py-6 px-4 border-sky-400 rounded-md min-h-[200px] flex flex-wrap items-center justify-center">
        <p className="text-xl">
          <i className="fas fa-upload text-xl text-sky-400"></i>
          &nbsp;&nbsp;Drag and drop File here to Upload
        </p>
        {value && value.length > 0 && (
          <table className="w-full mt-6 mx-auto text-sm max-w-[500px] table-border-full relative z-20">
            <thead>
              <tr>
                <th></th>
                <th>File name</th>
                {remove && <th></th>}
              </tr>
            </thead>
            <tbody>
              {value.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="text-slate-400">{item.name}</td>
                  {remove && (
                    <td>
                      <button
                        className="p-1 hover:text-red-400"
                        title="Remove"
                        onClick={() => remove(index)}
                      >
                        <i className="fas fa-xmark"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FieldVideo;
