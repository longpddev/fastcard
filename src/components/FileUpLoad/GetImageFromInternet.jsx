import React from "react";
import { useState } from "react";

function isImage64(url) {
  return /^data:image\/(jpeg|png|jpg)(;base64,).*/.test(url);
}

function getImageBase64(url) {
  if (!isImage64(url)) return Promise.resolve(url);

  return new Promise((res, rej) => {
    const image = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    image.crossOrigin = "anonymous";
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      canvas.toBlob((file) => {
        res(URL.createObjectURL(file));
      }, "image/png");
    };

    image.onerror = (error) => {
      console.warning(error);
      res(url);
    };
    image.src = url;
  });
}

const GetImageFromInternet = ({ setUrl, onSuccess }) => {
  const [typing, setTyping] = useState("");
  const handlePasteImage = (e) => {
    const items = e.clipboardData.items;
    if (!items) return;
    const blob = items[0].getAsFile();
    if (!blob) return;
    setUrl(URL.createObjectURL(blob));
    setTyping("");
  };
  return (
    <>
      <div className="flex items-center relative z-10 max-w-[300px] w-full text-slate-400 text-sm mt-4">
        <span>or,</span>
        <input
          type="text"
          className="inline-block bg-transparent py-1 ml-3"
          value={typing}
          placeholder="Paste url here"
          onPaste={handlePasteImage}
          onChange={(e) => setTyping(e.target.value.trim())}
        />
        <button
          className="ml-2 hover:text-green-400 text-lg"
          onClick={() =>
            typing.length > 3 &&
            getImageBase64(typing).then((url) => setUrl(url))
          }
        >
          <i className="fa-solid fa-check"></i>
        </button>
      </div>
    </>
  );
};

export default GetImageFromInternet;
