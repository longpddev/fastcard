'use client';

import { firstCapitalize } from '@/functions/common';
import React, { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import When from '@/ui/When';
import FindImageByWords from '@/ui/FindImageByWords/FindImageByWords';
import UrbanDefinitions from './UrbanDefinitions';
import { IReactProps } from '@/interfaces/common';
import {
  IDictionaryapiResponse,
  IDictionaryapiPartOfSpeech,
  IDictionaryapiDefinition,
} from '../../hooks/useWordDefinitions';

const PopupWordDefinitionsContent: IReactProps<{
  data: IDictionaryapiResponse;
  onDefineMore: (t: string) => void;
  originalText: string;
}> = ({ data, onDefineMore, originalText }) => {
  return (
    <>
      <div className="p-4">
        {data ? (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="self-center pr-2 text-xl text-slate-600">
              Phonetic:{' '}
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

        <div className="mb-4 max-h-[150px] overflow-auto" tabIndex={0}>
          <FindImageByWords words={originalText} />
        </div>
        <div className="mb-4">
          <UrbanDefinitions words={originalText} onDefineMore={onDefineMore} />
        </div>

        {data ? (
          <>
            <h3 className="mb-4 text-xl text-slate-600">Meanings: </h3>
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

const Phonetic: IReactProps<{
  text: string | undefined;
  audio: string | null;
  selected: boolean;
}> = ({ text, audio, className, selected }) => {
  const [playing, playingSet] = useState(false);

  const audioRef = useRef<Promise<HTMLAudioElement>>();
  if (!audioRef.current) {
    if (audio) {
      audioRef.current = new Promise<HTMLAudioElement>((res, rej) => {
        const au = new Audio(audio);
        au.oncanplay = () => res(au);
        au.onplaying = () => playingSet(true);
        au.onended = () => playingSet(false);
        au.onpause = () => playingSet(false);
        au.onerror = () => rej('not found');
      });
    } else {
      audioRef.current = Promise.reject('not found');
    }
  }

  const handleClick = () => {
    if (playing) {
      audioRef.current?.then((au) => au.pause());
    } else {
      audioRef.current?.then((au) => au.play());
    }
  };

  return (
    <button
      onClick={handleClick}
      autoFocus={selected}
      className={clsx(
        'icon-center-button group relative overflow-hidden rounded-full bg-slate-600 px-4 py-1',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800',
        {
          'focus:ring-blue-500': audio,
          'focus:ring-slate-600': !audio,
        },
        className,
      )}
    >
      <When if={Boolean(audio)}>
        <span
          className={clsx('absolute inset-0 block h-full w-full bg-black', {
            'opacity-20': playing,
            'opacity-0 group-hover:opacity-20': !playing,
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

const Meaning: IReactProps<{
  partOfSpeech: IDictionaryapiPartOfSpeech;
  definitions: Array<IDictionaryapiDefinition>;
}> = ({ partOfSpeech, definitions }) => {
  return (
    <>
      <h3 className="text-semibold text-lg text-sky-400">
        {firstCapitalize(partOfSpeech)}:{' '}
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
