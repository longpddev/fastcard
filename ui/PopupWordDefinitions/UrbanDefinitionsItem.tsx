'use client';

import { firstCapitalize, parseStringToArr } from '@/functions/common';
import ReadMoreText from '@/ui/ReadMoreText';
import React, { useMemo, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { IReactProps } from '@/interfaces/common';
import { IUrbanData } from '@/hooks/useUrbanDictionary';

const UrbanDefinitionsItem: IReactProps<{
  urbanData: IUrbanData;
  onDefineMore: (w: string) => void;
}> = ({ urbanData, onDefineMore }) => {
  const onDefineMoreForward = useRef(onDefineMore);
  onDefineMoreForward.current = onDefineMore;
  const definitionParse = useMemo(
    () =>
      parseStringToArr(firstCapitalize(urbanData.definition)).map(
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
    [urbanData.definition],
  );

  const exampleParse = useMemo(
    () =>
      parseStringToArr(firstCapitalize(urbanData.example)).map(
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
    [urbanData.example],
  );

  return (
    <div className="flex min-w-[300px] flex-col rounded-md border border-orange-400 p-4 pb-2">
      <div>
        <h3 className="mb-4 text-center text-xl font-semibold text-slate-400">
          {firstCapitalize(urbanData.word)}
        </h3>
        <ReadMoreText className="mb-4 flex flex-wrap text-lg">
          {definitionParse}
        </ReadMoreText>
        <ReadMoreText
          className="mb-2 flex flex-wrap "
          classNameText="italic text-slate-400"
        >
          {exampleParse}
        </ReadMoreText>
      </div>
      <div className="mt-auto flex text-slate-600">
        <small className="mr-auto">{urbanData.written_on}</small>
        {urbanData.sound_urls.map((url, i) => (
          <PlaySource url={url} key={i} />
        ))}

        <a
          rel="noreferrer"
          href={urbanData.permalink}
          target="_blank"
          title="link to urban"
          className="ml-2"
        >
          <i className="fas fa-link"></i>
        </a>
      </div>
    </div>
  );
};

const PlaySource: IReactProps<{
  url: string;
}> = ({ url }) => {
  const audio = useRef<Promise<HTMLAudioElement>>();
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
      audio.current?.then((au) => au.pause());
    } else {
      audio.current?.then((au) => au.play());
    }
  };
  return (
    <button
      className={clsx({
        'text-sky-400': playing,
      })}
      onClick={handlePlay}
      title="play audio"
    >
      <i className="fa-regular fa-file-audio"></i>
    </button>
  );
};

export default UrbanDefinitionsItem;
