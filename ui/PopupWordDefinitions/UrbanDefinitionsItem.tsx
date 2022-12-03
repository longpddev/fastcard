'use client';

import { firstCapitalize, parseStringToArr } from '@/functions/common';
import ReadMoreText from '@/ui/ReadMoreText';
import React, { useMemo, useRef, useState } from 'react';
import { clsx } from 'clsx';

const UrbanDefinitionsItem = ({
  word,
  written,
  definition,
  permalink,
  example,
  sound_urls,
  onDefineMore,
}) => {
  const onDefineMoreForward = useRef();
  onDefineMoreForward.current = onDefineMore;
  const definitionParse = useMemo(
    () =>
      parseStringToArr(firstCapitalize(definition)).map(
        ({ text, isMatch }, i) => {
          const pureText = text.slice(1, text.length - 1);
          return isMatch ? (
            <a
              className="cursor-pointer underline hover:text-sky-300"
              key={i}
              onClick={(e) => {
                onDefineMoreForward.current &&
                  onDefineMoreForward.current(pureText);
              }}
            >
              {pureText}
            </a>
          ) : (
            <React.Fragment key={i}>{text}</React.Fragment>
          );
        },
      ),
    [definition],
  );

  const exampleParse = useMemo(
    () =>
      parseStringToArr(firstCapitalize(example)).map(({ text, isMatch }, i) => {
        const pureText = text.slice(1, text.length - 1);
        return isMatch ? (
          <a
            className="cursor-pointer underline hover:text-sky-300"
            key={i}
            onClick={(e) => {
              onDefineMoreForward.current &&
                onDefineMoreForward.current(pureText);
            }}
          >
            {pureText}
          </a>
        ) : (
          <React.Fragment key={i}>{text}</React.Fragment>
        );
      }),
    [example],
  );

  return (
    <div className="flex min-w-[300px] flex-col rounded-md border border-orange-400 p-4 pb-2">
      <div>
        <h3 className="mb-4 text-center text-xl font-semibold text-slate-400">
          {firstCapitalize(word)}
        </h3>
        <ReadMoreText className="mb-4 flex flex-wrap text-lg">
          {definitionParse}
        </ReadMoreText>
        <ReadMoreText
          component={'div'}
          className="mb-2 flex flex-wrap "
          classNameText="italic text-slate-400"
        >
          {exampleParse}
        </ReadMoreText>
      </div>
      <div className="mt-auto flex text-slate-600">
        <small className="mr-auto">{written}</small>
        {sound_urls.map((url, i) => (
          <PlaySource url={url} key={i} />
        ))}

        <a href={permalink} target="_blank" className="ml-2">
          <i className="fas fa-link"></i>
        </a>
      </div>
    </div>
  );
};

const PlaySource = ({ url }) => {
  const audio = useRef();
  const [playing, playingSet] = useState(false);
  if (!audio.current) {
    audio.current = new Promise((res, rej) => {
      const au = new Audio(url);
      au.oncanplay = () => res(au);
      au.onerror = (e) => rej(e);
      au.onplaying = () => playingSet(true);
      au.onended = () => playingSet(false);
      au.onpause = () => playingSet(false);
    });
  }
  const handlePlay = () => {
    if (playing) {
      audio.current.then((au) => au.pause());
    } else {
      audio.current.then((au) => au.play());
    }
  };
  return (
    <button
      className={clsx({
        'text-sky-400': playing,
      })}
      onClick={handlePlay}
    >
      <i className="fa-regular fa-file-audio"></i>
    </button>
  );
};

export default UrbanDefinitionsItem;
