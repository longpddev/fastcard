'use client';

import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { pushToast } from '@/ui/Toast';
import { formatByteUnit } from '@/functions/common';
import { IReactProps } from '@/interfaces/common';

const FieldVideo: IReactProps<{
  value: Array<File>;
  valueSet: (v: Array<File>) => void;
  thumbnail: string;
  thumbnailSet: (v: string) => void;
  hasValue: boolean;
  urlDemo: string;
}> = ({ value, valueSet, thumbnail, thumbnailSet, hasValue, urlDemo }) => {
  return (
    <div>
      {!hasValue && (
        <FieldFileUi
          value={value}
          valueSet={valueSet}
          accept={'video/*'}
          size={1024 * 1024 * 400}
        />
      )}

      {hasValue && (
        <div className="block-up mb-4 rounded-md p-4">
          <PreviewVideo
            src={urlDemo}
            onRemove={() => {
              valueSet([]);
              thumbnailSet('');
            }}
            thumbnail={thumbnail}
            thumbnailSet={thumbnailSet}
          />
        </div>
      )}
    </div>
  );
};

const PreviewVideo: IReactProps<{
  src: string;
  onRemove: () => void;
  thumbnail: string;
  thumbnailSet: (v: string) => void;
}> = ({ src, onRemove, thumbnail, thumbnailSet }) => {
  const [loaded, loadedSet] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  async function getThumbnailVideo(videoEl: HTMLVideoElement) {
    const canvas = document.createElement('canvas');
    const { videoWidth, videoHeight } = videoEl;
    console.dir(videoEl);

    canvas.width = 400;
    canvas.height = Math.floor(((400 * videoHeight) / videoWidth) * 10) / 10;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('can\t get ctx in canvas');
    ctx.drawImage(
      videoEl,
      0,
      0,
      videoWidth,
      videoHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    return canvas.toDataURL();
  }

  return (
    <div className="relative mx-auto max-w-[600px]">
      <video src={src} ref={ref} controls className=""></video>
      <div className="absolute top-1 right-4 z-10 drop-shadow-[0_0_4px_black]">
        <button
          onClick={onRemove}
          title="remove"
          className="icon-center-button relative h-6 w-6 p-2 hover:text-orange-400"
        >
          <i className="fas fa-xmark text-xl"></i>
        </button>
        <button
          title="preview"
          onClick={() => {
            const el = ref.current;
            if (!el) return;
            getThumbnailVideo(el).then((linkImage) => {
              thumbnailSet(linkImage);
              pushToast.success(`Create thumbnail success ![link](${linkImage} "Preview")
                `);
            });
          }}
          className="icon-center-button relative ml-2 h-6 w-6 p-2 hover:text-orange-400"
        >
          <i className="fa-solid fa-photo-film text-xl"></i>
        </button>
      </div>
      {thumbnail && (
        <ImagePreviewVideoAnimate
          key={thumbnail}
          src={thumbnail}
          className="pointer-events-none absolute inset-0 block h-full w-full scale-100 opacity-100 transition-all"
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

const ImagePreviewVideoAnimate: IReactProps<{
  src: string;
  alt: string;
}> = (props) => {
  const [hide, hideSet] = useState(false);

  useEffect(() => {
    hideSet(true);
  }, []);
  return (
    <img
      {...props}
      style={{
        opacity: hide ? 0 : '',
        transform: hide ? 'scale(1.2)' : '',
      }}
    />
  );
};

const FieldFileUi: IReactProps<{
  value: Array<File>;
  valueSet: (v: Array<File>) => void;
  remove?: (v: number) => void;
  accept: string;
  size: number;
}> = ({ value, valueSet, remove, accept, size, ...props }) => {
  const handleChange = ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    const regex = new RegExp(accept.replace('*', '.*'));
    const checkFile = (file: File) => {
      let result = regex.test(file.type);
      if (!result) {
        const fileName =
          file.name.length > 20 ? file.name.slice(0, 20) + '...' : file.name;
        pushToast.error(
          `File: ${fileName} with type: ${file.type}. Which don\'t except please pick another.`,
        );
      }
      result = file.size <= size;

      if (!result) {
        pushToast.error(
          `${formatByteUnit(file.size).text} > ${
            formatByteUnit(size).text
          } that size limit for upload. Please choose file size lower.`,
        );
      }
      return result;
    };

    const fileListToArray = [...(files ?? [])];
    const validate = fileListToArray.every(checkFile);

    if (validate) {
      valueSet(fileListToArray);
    }
  };
  return (
    <div className="relative min-h-[200px] w-full">
      <input
        type="file"
        title=""
        className="absolute inset-0 z-10 block h-full w-full cursor-pointer opacity-0"
        accept={accept}
        onChange={handleChange}
        {...props}
      />
      <div className="flex min-h-[200px] flex-wrap items-center justify-center rounded-md border-2 border-dashed border-sky-400 py-6 px-4 text-center">
        <p className="text-xl">
          <i className="fas fa-upload text-xl text-sky-400"></i>
          &nbsp;&nbsp;Drag and drop File here to Upload
        </p>
        {value && value.length > 0 && (
          <table className="table-border-full relative z-20 mx-auto mt-6 w-full max-w-[500px] text-sm">
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
