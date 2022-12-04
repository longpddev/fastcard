'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import getCroppedImg from '../../helpers/cropimage';
import Cropper, { Area } from 'react-easy-crop';
import { IBlobImage, ICroppedImage, IReactProps } from '@/interfaces/common';

const PopupCropMain: IReactProps<{
  url: string;
  cropHeight: number;
  setOpen: (s: boolean) => void;
  setCroppedImage: (v: IBlobImage) => void;
}> = ({ url, cropHeight, setCroppedImage, setOpen }) => {
  const ref = useRef<HTMLDivElement>(null);
  const resizeCropRef = useRef(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const closePopup = () => {
    resizeCropRef.current = false;
    setOpen && setOpen(false);
  };
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      let minToZoom = Math.min(croppedArea.height, croppedArea.width);
      minToZoom = Math.round(minToZoom * 1000) / 1000;

      if (resizeCropRef.current === false && minToZoom !== 100) {
        resizeCropRef.current = true;
        setZoom(minToZoom / 100);
      }
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const getCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) {
      return;
    }

    try {
      const result = await getCroppedImg(url, croppedAreaPixels);

      setCroppedImage(result);
      closePopup();
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation, flip]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const handleWheel = (event: WheelEvent) => {
      setZoom((prev) => {
        return (prev += event.deltaY * 0.0001);
      });
      event.preventDefault();
      event.stopPropagation();
    };
    container.addEventListener('wheel', handleWheel, true);

    return () => container.removeEventListener('wheel', handleWheel, true);
  }, []);

  useEffect(() => {
    resizeCropRef.current = false;
  }, [url]);
  return (
    <>
      <div
        ref={ref}
        className="relative"
        style={{ minHeight: `${cropHeight}px` }}
        onWheel={(e) => {
          // scale += event.deltaY * -0.01;
        }}
      >
        <Cropper
          image={url}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          cropSize={{ width: 400, height: 300 }}
          restrictPosition={false}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="flex flex-wrap bg-slate-800 p-5">
        <div className="flex items-center space-x-2">
          <label htmlFor="crop-zoom">Zoom</label>
          <input
            type="range"
            id="crop-zoom"
            className="min-w-[200px]"
            min={0}
            value={zoom * 100}
            onChange={(e) => setZoom(parseInt(e.target.value) / 100)}
            max={300}
          />
          <span className="text-sm font-semibold">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <button
          onClick={getCroppedImage}
          className="button ml-auto text-green-400"
        >
          Good
        </button>
      </div>
    </>
  );
};

export default PopupCropMain;
