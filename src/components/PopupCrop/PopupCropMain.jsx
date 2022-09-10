import React, { useCallback, useEffect, useRef, useState } from "react";
import getCroppedImg from "../../helpers/cropimage";
import Cropper from "react-easy-crop";

const PopupCropMain = ({ url, cropHeight, setCroppedImage, setOpen }) => {
  const ref = useRef();
  const resizeCropRef = useRef(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const closePopup = () => {
    resizeCropRef.current = false;
    setOpen && setOpen(false);
  };
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    let minToZoom = Math.min(croppedArea.height, croppedArea.width);
    minToZoom = parseInt(minToZoom * 1000) / 1000;

    if (resizeCropRef.current === false && minToZoom !== 100) {
      resizeCropRef.current = true;
      setZoom(minToZoom / 100);
    }
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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
    const handleWheel = (event) => {
      setZoom((prev) => {
        return (prev += event.deltaY * 0.0001);
      });
      event.preventDefault();
      event.stopPropagation();
    };
    container.addEventListener("wheel", handleWheel, true);

    return () => container.removeEventListener("wheel", handleWheel, true);
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
          scale += event.deltaY * -0.01;
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
        <div className="flex space-x-2 items-center">
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
          <span className="text-sm font-semibold">{parseInt(zoom * 100)}%</span>
        </div>

        <button
          onClick={getCroppedImage}
          className="button text-green-400 ml-auto"
        >
          Good
        </button>
      </div>
    </>
  );
};

export default PopupCropMain;
