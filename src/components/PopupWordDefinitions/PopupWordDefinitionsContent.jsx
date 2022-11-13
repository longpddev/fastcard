import { firstCapitalize } from "@/functions/common";
import React, { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import When from "@components/When";
import FindImageByWords from "@components/FindImageByWords/FindImageByWords";
import UrbanDefinitions from "./UrbanDefinitions";

const PopupWordDefinitionsContent = ({ data, onDefineMore, originalText }) => {
  return (
    <>
      <div className="p-4">
        {data ? (
          <div className="flex flex-wrap gap-2 mb-4">
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
        ) : null}

        <div className="max-h-[150px] overflow-auto mb-4" tabIndex={0}>
          <FindImageByWords words={originalText} />
        </div>
        <div className="mb-4">
          <UrbanDefinitions words={originalText} onDefineMore={onDefineMore} />
        </div>

        {data ? (
          <>
            <h3 className="text-slate-600 text-xl mb-4">Meanings: </h3>
            <div className="pl-4">
              {data.meanings.map((item, i) => (
                <Meaning
                  key={i}
                  partOfSpeech={item.partOfSpeech}
                  definitions={item.definitions}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

const Phonetic = ({ text, audio, className, selected }) => {
  const [playing, playingSet] = useState(false);

  const audioRef = useRef();
  if (!audioRef.current) {
    if (audio) {
      audioRef.current = new Promise((res, rej) => {
        const au = new Audio(audio);
        au.oncanplay = () => res(au);
        au.onplaying = () => playingSet(true);
        au.onended = () => playingSet(false);
        au.onpause = () => playingSet(false);
        au.onerror = () => rej("not found");
      });
    } else {
      audioRef.current = Promise.reject("not found");
    }
  }

  const handleClick = () => {
    if (playing) {
      audioRef.current.then((au) => au.pause());
    } else {
      audioRef.current.then((au) => au.play());
    }
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
          className={clsx("absolute inset-0 w-full h-full block bg-black", {
            "opacity-20": playing,
            "group-hover:opacity-20 opacity-0": !playing,
          })}
        ></span>
        {playing ? (
          <i className="fas fa-pause opacity-70"></i>
        ) : (
          <i className="fas fa-play opacity-0 group-hover:opacity-70 "></i>
        )}
      </When>

      <span>{text || `¯\\_(ツ)_/¯`}</span>
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
