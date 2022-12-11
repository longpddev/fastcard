'use client';

import {
  ATTRIBUTE_SHORTCUT_BUTTON,
  SHORTCUT_ACCEPT,
  SHORTCUT_TYPING_TRANSLATE_TOGGLE_PLACEHOLDER,
} from '@/constants/index';
import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useShortcut, { useKeyupShortcut } from '@/hooks/useShortcut';
import { IReactProps } from '@/interfaces/common';
const KEY_IGNORE = {
  Backspace: 'Backspace',
  Control: 'Control',
  Meta: 'Meta',
  Alt: 'Alt',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  Shift: 'Shift',
  Enter: 'Enter',
  Escape: 'Escape',
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12',
  Tab: 'Tab',
  CapsLock: 'CapsLock',
};

/**
 * HIGHLIGHT_ERROR: highlight the letter when user typed wrong
 * RETYPING_ERROR: retyping the word if user typed wrong
 */
export const TYPE_TRANSLATE_MODE = Object.freeze({
  HIGHLIGHT_ERROR: 'HIGHLIGHT_ERROR',
  RETYPING_ERROR: 'RETYPING_ERROR',
});

type ITYPE_TRANSLATE_MODE = typeof TYPE_TRANSLATE_MODE;
/**
 * @param {{
 *   className: string,
 *   text: string,
 *   onDone: () => void,
 *   style: Record<string, string>,
 *   isFocus: boolean,
 *   shortcut: string,
 *   isFocusSet: boolean,
 *   mode: TYPE_TRANSLATE_MODE[keyof TYPE_TRANSLATE_MODE]
 * }} param0
 * @returns
 */
const TypeTranslate: IReactProps<{
  className: string;
  text: string;
  onDone: () => void;
  style: Record<string, string>;
  isFocus: boolean;
  shortcut: string;
  isFocusSet: (s: boolean) => void;
  mode?: ITYPE_TRANSLATE_MODE[keyof ITYPE_TRANSLATE_MODE];
  alwayShowPlaceholder?: boolean;
}> = ({
  className,
  text,
  onDone,
  style,
  isFocus,
  shortcut,
  isFocusSet,
  mode = TYPE_TRANSLATE_MODE.RETYPING_ERROR,
  alwayShowPlaceholder = false,
}) => {
  // [[ 'a', 'b', 'c' ], [ 'a', 'b', 'c' ]]
  const words = useMemo(
    () => text.split(' ').map((item) => item.split('')),
    [text],
  );
  const [showPlaceholder, showPlaceholderSet] = useState(false);
  const masksOfWords = useMemo(
    () => words.map((word) => word.map(() => 0)),
    [words],
  );
  const [pointOfWord, pointOfWordSet] = useState(0);
  const [pointOfLetterInWord, pointOfLetterInWordSet] = useState(0);

  const [tmpText, tmpTextSet] = useState('');

  const ref = useRef<HTMLInputElement>(null);

  const wordsClone = structuredClone(words);
  const masksOfWordsClone = structuredClone(masksOfWords);

  const currentWord = () => wordsClone[pointOfWord];
  const currentLetter = () => wordsClone[pointOfWord][pointOfLetterInWord];
  const currentMaskWord = () => masksOfWordsClone[pointOfWord];

  const isNextLetterInWord = () =>
    currentWord().length >= pointOfLetterInWord + 1;
  const isNextWord = () => words.length > pointOfWord + 1;
  const remarkMaskWord = () =>
    (masksOfWords[pointOfWord] = currentMaskWord().map(() => 0));
  const retypeWord = () => {
    pointOfLetterInWordSet(0);
    remarkMaskWord();
  };
  const markLetter = (type: 1 | -1) => {
    if (masksOfWords[pointOfWord][pointOfLetterInWord] === 0) {
      masksOfWords[pointOfWord][pointOfLetterInWord] = type;
    }
  };
  const isSpace = () => !isNextLetterInWord() && isNextWord();
  const handleTyping = (char: string) => {
    if (char in KEY_IGNORE) return false;

    if (isSpace()) {
      if (char !== ' ') return false;
    } else if (char !== currentLetter()) {
      switch (mode) {
        case TYPE_TRANSLATE_MODE.HIGHLIGHT_ERROR:
          markLetter(-1);

          return false;
        case TYPE_TRANSLATE_MODE.RETYPING_ERROR:
          retypeWord();
          return false;
      }
    }
    markLetter(1);
    if (isSpace()) {
      pointOfWordSet(pointOfWord + 1);
      pointOfLetterInWordSet(0);
    } else if (isNextLetterInWord()) {
      pointOfLetterInWordSet(pointOfLetterInWord + 1);
    } else {
      return false;
    }

    return true;
  };

  useShortcut(shortcut, () => isFocusSet(true));

  useShortcut(SHORTCUT_TYPING_TRANSLATE_TOGGLE_PLACEHOLDER, () =>
    showPlaceholderSet(true),
  );

  useKeyupShortcut(SHORTCUT_ACCEPT, () => {
    if (!showPlaceholder) return;
    showPlaceholderSet(false);
  });
  useEffect(() => {
    if (!isFocus) return;
    ref.current && ref.current.focus();
  }, [isFocus]);

  useEffect(() => {
    if (!isNextWord() && !isNextLetterInWord()) {
      onDone();
      tmpTextSet('');
    }
  }, [pointOfWord, pointOfLetterInWord]);
  const renderWords = words
    .map((word, i_word) => (
      <React.Fragment key={i_word + 1}>
        <span className="whitespace-nowrap">
          {word.map((letter, i_letter) => (
            <span key={(i_word + 1) * (i_letter + 1)} className="relative">
              <Point
                isActive={
                  i_word === pointOfWord && i_letter === pointOfLetterInWord
                }
                isSleep={!isFocus}
              />
              <span
                className={clsx(``, {
                  [`${
                    !isFocus || alwayShowPlaceholder || showPlaceholder
                      ? 'text-slate-300 opacity-50'
                      : 'unset-text-shadow bg-slate-300 text-slate-300 opacity-30'
                  }`]: masksOfWords[i_word][i_letter] === 0,
                  'text-red-500': masksOfWords[i_word][i_letter] === -1,
                  'text-sky-400': masksOfWords[i_word][i_letter] === 1,
                })}
              >
                {letter}
              </span>
            </span>
          ))}
        </span>
        <span className="relative">
          <Point
            isActive={i_word === pointOfWord && isSpace()}
            isSleep={!isFocus}
          />
          &nbsp;
        </span>
      </React.Fragment>
    ))
    .flat();

  return (
    <div
      tabIndex={0}
      {...{ [ATTRIBUTE_SHORTCUT_BUTTON]: shortcut }}
      className={clsx(
        className,
        'outline-unset text-slate-800 focus-visible:outline-none',
        {
          'border border-sky-400': isFocus,
          'cursor-pointer border border-transparent': !isFocus,
        },
      )}
      style={{
        ...style,
        textShadow:
          'black .5px 0px,black -.5px 0px, black 0px .5px,black 0px -.5px',
      }}
    >
      <input
        type="text"
        ref={ref}
        title="typing here"
        onFocus={isFocusSet.bind(undefined, true)}
        onBlur={isFocusSet.bind(undefined, false)}
        value={tmpText}
        onChange={(e) => {
          const val = e.target.value;
          if (!val) {
            tmpTextSet('');
            return;
          }
          if (handleTyping(val[val.length - 1])) {
            tmpTextSet(val);
          }
        }}
        className="absolute inset-0 h-full w-full bg-orange-400 text-transparent opacity-0"
      />
      <div>{renderWords}</div>
    </div>
  );
};

const Point: IReactProps<{
  isActive: boolean;
  isSleep: boolean;
}> = ({ isActive, isSleep }) => {
  if (!isActive) return null;
  return (
    <span
      className={clsx(
        'point-animate absolute left-0 top-1/2 translate-x-[-50%] translate-y-[-50%] text-white ',
        {
          'point-animate-stop': isSleep,
        },
      )}
      style={{
        textShadow: 'none',
      }}
    />
  );
};
export default TypeTranslate;
