import React from "react";
import { useState } from "react";
import { getImageBase64 } from "../../functions/common";

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
          className="inline-block bg-transparent py-1 ml-3 input"
          value={typing}
          placeholder="Paste url here"
          onPaste={handlePasteImage}
          onDrop={async (e) => {
            e.preventDefault();
            const meta = e.dataTransfer.getData("text/html");
            if (!meta) return;
            const fragment = document.createElement("div");
            fragment.innerHTML = meta;
            const image = fragment.getElementsByTagName("img")[0];
            if (!image || !image.getAttribute("src")) return;
            getImageBase64(image.getAttribute("src")).then((url) => {
              console.log(url);
              setUrl(url);
            });
          }}
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
