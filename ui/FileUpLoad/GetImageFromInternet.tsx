'use client';

import React from 'react';
import { useState } from 'react';
import { getImageBase64 } from '@/functions/common';
import { IReactProps } from '@/interfaces/common';

const GetImageFromInternet: IReactProps<{
  setUrl: (v: string) => void;
}> = ({ setUrl }) => {
  const [typing, setTyping] = useState('');
  const handlePasteImage = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    if (!items) return;
    const blob = items[0].getAsFile();
    if (!blob) return;
    setUrl(URL.createObjectURL(blob));
    setTyping('');
  };
  return (
    <>
      <div className="relative z-10 mt-4 flex w-full max-w-[300px] items-center text-sm text-slate-400">
        <span>or,</span>
        <input
          type="text"
          className="input ml-3 inline-block bg-transparent py-1"
          value={typing}
          placeholder="Paste url here"
          onPaste={handlePasteImage}
          onDrop={async (e) => {
            e.preventDefault();
            const meta = e.dataTransfer.getData('text/html');
            if (!meta) return;
            const fragment = document.createElement('div');
            fragment.innerHTML = meta;
            const image = fragment.getElementsByTagName('img')[0];
            if (!image || !image.getAttribute('src')) return;
            getImageBase64(image.src).then((url) => {
              console.log(url);
              setUrl(url);
            });
          }}
          onChange={(e) => setTyping(e.target.value.trim())}
        />
        <button
          title="init image"
          className="ml-2 text-lg hover:text-green-400"
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
