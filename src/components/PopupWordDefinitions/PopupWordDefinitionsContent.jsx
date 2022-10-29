import { firstCapitalize } from "@/functions/common";
import React, { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import When from "@components/When";
import FindImageByWords from "@components/FindImageByWords/FindImageByWords";

const PopupWordDefinitionsContent = ({ data }) => {
  return (
    <>
      <h2 className="text-center font-semibold text-slate-200 text-2xl my-4">
        {firstCapitalize(data.word)}
      </h2>

      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          <span className="self-center pr-2 text-xl text-slate-600">
            Phonetic:{" "}
          </span>
          {data.phonetics.map((item, i) => (
            <Phonetic
              text={item.text}
              audio={item.audio}
              key={i}
              selected={i === 0}
            />
          ))}
        </div>
        <div className="max-h-[150px] overflow-auto mt-6" tabIndex={0}>
          <FindImageByWords words={data.word} />
        </div>
        <h3 className="text-slate-600 text-xl mt-4">Meanings: </h3>
        <div className="pl-4 overflow-auto max-h-[70vh]">
          {data.meanings.map((item, i) => (
            <Meaning
              key={i}
              partOfSpeech={item.partOfSpeech}
              definitions={item.definitions}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const Phonetic = ({ text, audio, className, selected }) => {
  const [playing, playingSet] = useState(false);

  const ref = useRef({
    onLoaded: null,
    el: null,
  });

  const assignRef = (el) => {
    if (el && ref.current.el !== el) {
      ref.current.el = el;
      ref.current.onLoaded = new Promise((res, rej) => {
        el.oncanplay = () => {
          if (ref.current.el !== el) return;
          res(el);
        };
        el.onerror = () => {
          if (ref.current.el !== el) return;
          rej(el);
        };
      });
    }
  };

  const handleClick = () => {
    if (!ref.current.el || playing) return;
    const el = ref.current;
    el.onLoaded.then(() => {
      el.el.play();
      playingSet(true);
      el.el.onended = () => playingSet(false);
    });
  };

  return (
    <button
      onClick={handleClick}
      autoFocus={selected}
      className={clsx(
        "px-4 py-1 rounded-full group relative icon-center-button bg-slate-600 overflow-hidden",
        "focus:ring-offset-slate-800 focus:ring-offset-2 focus:outline-none focus:ring-2",
        {
          "focus:ring-blue-500": audio,
          "focus:ring-slate-600": !audio,
        },
        className
      )}
    >
      <When if={audio}>
        <span
          className={clsx("absolute inset-0 w-full h-full block bg-black ", {
            "opacity-20": playing,
            "group-hover:opacity-20 opacity-0": !playing,
          })}
        ></span>
        {playing ? (
          <i className="fas fa-pause opacity-70"></i>
        ) : (
          <i className="fas fa-play opacity-0 group-hover:opacity-70 transition-all"></i>
        )}
      </When>

      <span>{text || `¯\\_(ツ)_/¯`}</span>
      {audio && <audio ref={assignRef} src={audio}></audio>}
    </button>
  );
};

const Meaning = ({ partOfSpeech, definitions }) => {
  return (
    <>
      <h3 className="text-lg text-semibold text-sky-400">
        {firstCapitalize(partOfSpeech)}:{" "}
      </h3>
      <div className="">
        {definitions.map((item, i) => (
          <div className="pl-4" key={i}>
            <p className="font-bold">- {firstCapitalize(item.definition)}</p>
            <p className="text-slate-500">Exp: {item.example}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default PopupWordDefinitionsContent;
