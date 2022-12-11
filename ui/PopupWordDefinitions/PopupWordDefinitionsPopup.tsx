'use client';

import {
  SHORTCUT_ACCEPT,
  SHORTCUT_TOGGLE_WORD_DEFINITION,
  SHORTCUT_WORD_DEFINITION_BACK,
  SHORTCUT_WORD_DEFINITION_NEXT,
} from '@/constants/index';
import { firstCapitalize, getTextSelect } from '@/functions/common';
import ButtonShortCut from '@/ui/ButtonShortCut';
import LoadingIcon from '@/ui/LoadingIcon';
import Popup from '@/ui/Popup/index';
import When from '@/ui/When';
import useShortcut from '@/hooks/useShortcut';
import useWordDefinitions from '@/hooks/useWordDefinitions';
import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import PopupWordDefinitionsContent from './PopupWordDefinitionsContent';
import { IReactProps } from '@/interfaces/common';

type test = typeof PopupWordDefinitionsSearchBy extends IReactProps
  ? 'true'
  : 'false';
const PopupWordDefinitionsPopup: IReactProps<{
  onClose: () => void;
  words: string;
}> = ({ onClose, words = '' }) => {
  const [stack, stackSet] = useState<Array<string>>([]);
  const [stackPoint, stackPointSet] = useState(0);
  const [word, wordSet] = useState(words);
  const [typing, typingSet] = useState(words ? false : true);
  let { data, isLoading, isNotfound } = useWordDefinitions(typing ? '' : word);
  const forwardVar = useRef(
    {} as {
      stack: typeof stack;
      stackPoint: typeof stackPoint;
      word: typeof word;
      typing: typeof typing;
      data: typeof data;
    },
  );

  forwardVar.current = {
    stack,
    stackPoint,
    word,
    typing,
    data,
  };

  const handleWordSet = (word: string) => {
    wordSet(word);
    const newList = [...stack, word];
    stackSet(newList);
    stackPointSet(newList.length - 1);
  };

  // can forward to input => help use can change the word want to search
  // and help user can close with this shortcut
  // working like toggle feature
  useShortcut(SHORTCUT_TOGGLE_WORD_DEFINITION, () => {
    if (typing) {
      onClose();
    }
    typingSet(true);
  });

  const handleNavigateStack = (jump: 1 | -1) => () => {
    const fw = forwardVar.current;
    const targetPoint = fw.stackPoint + jump;
    if (targetPoint < 0 || targetPoint > fw.stack.length - 1) return;
    wordSet(fw.stack[targetPoint]);
    stackPointSet(targetPoint);
  };

  return (
    <Popup maxWidth={800} open={true} setOpen={onClose}>
      <When
        if={typing}
        component={PopupWordDefinitionsSearchBy}
        props={{
          searchBy: (w) => {
            handleWordSet(w);
            typingSet(false);
          },
        }}
      />
      <When if={!typing && isLoading}>
        <div className="flex h-24 w-full items-center justify-center">
          <LoadingIcon className="animate-spin text-2xl text-sky-400"></LoadingIcon>
        </div>
      </When>
      <When if={!typing && !isLoading}>
        {() => (
          <div>
            <h2 className="relative my-4 text-center text-2xl font-semibold text-slate-200">
              {stackPoint !== 0 ? (
                <div className=" absolute top-0 left-0 flex">
                  <ButtonShortCut
                    shortcut={SHORTCUT_WORD_DEFINITION_BACK}
                    onClick={handleNavigateStack(-1)}
                    className="icon-center-button relative h-8 w-10"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </ButtonShortCut>
                </div>
              ) : null}
              {firstCapitalize(word)}

              {stackPoint !== stack.length - 1 ? (
                <div className="absolute top-0 right-0 flex">
                  <ButtonShortCut
                    shortcut={SHORTCUT_WORD_DEFINITION_NEXT}
                    onClick={handleNavigateStack(1)}
                    className="icon-center-button relative h-8 w-10"
                  >
                    <i className="fas fa-arrow-right"></i>
                  </ButtonShortCut>
                </div>
              ) : null}
            </h2>

            {data && (
              <PopupWordDefinitionsContent
                onDefineMore={(text) => {
                  for (let i = 0; i < stack.length; i++) {
                    if (stack[i] === text) {
                      stackPointSet(i);
                      wordSet(text);
                      return;
                    }
                  }
                  handleWordSet(text);
                }}
                data={data}
                originalText={word}
              />
            )}
          </div>
        )}
      </When>
    </Popup>
  );
};

const PopupWordDefinitionsSearchBy: IReactProps<{
  searchBy: (v: string) => void;
}> = ({ searchBy }) => {
  const [word, wordSet] = useState(() => getTextSelect());
  const bypass = useRef('');
  bypass.current = word;
  useShortcut(SHORTCUT_ACCEPT, () => searchBy && searchBy(bypass.current));
  return (
    <div className="p-4">
      <h2 className="mb-4 text-center text-2xl font-semibold">
        Word Definitions
      </h2>
      <input
        type="text"
        className="input text-center"
        placeholder="Type word you want to Definition"
        value={word}
        autoFocus={true}
        onChange={(e) => {
          wordSet(e.target.value);
        }}
      />
    </div>
  );
};

export default PopupWordDefinitionsPopup;
