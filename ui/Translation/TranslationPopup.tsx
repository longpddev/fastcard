'use client';

import { SHORTCUT_ACCEPT, SHORTCUT_TOGGLE_TRANSLATE } from '@/constants/index';
import Popup from '@/ui/Popup';
import React from 'react';
import When from '@/ui/When';
import useRapitGoogleTranslate, {
  IFetchDataResponse,
} from '@/hooks/useRapitGoogleTranslate';
import LoadingIcon from '@/ui/LoadingIcon';
import TranslationContent from './TranslationContent';
import { useState } from 'react';
import useShortcut from '@/hooks/useShortcut';
import { matchShortCut } from '@/functions/common';
import { IReactProps } from '@/interfaces/common';

const TranslationPopup: IReactProps<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [typing, typingSet] = useState(true);
  const [textTranslate, textTranslateSet] = useState('');
  const { data, error, isLoading } = useRapitGoogleTranslate(textTranslate);

  useShortcut(SHORTCUT_TOGGLE_TRANSLATE, () => typingSet(true));

  // toggle popup open and close using one shortcut
  useShortcut(SHORTCUT_TOGGLE_TRANSLATE, () => typing && onClose());

  return (
    <Popup open={true} setOpen={onClose}>
      <When
        if={typing}
        component={TranslationInput}
        props={{
          setText: (text) => {
            typingSet(false);
            textTranslateSet(text);
          },
        }}
      />
      <When if={!typing && error}>
        <div className="relative flex h-20 w-full items-center justify-center">
          <p className="text-xl text-red-400">Translate fail.</p>
        </div>
      </When>
      <When if={!typing && isLoading}>
        <div className="relative flex h-20 w-full items-center justify-center">
          <LoadingIcon className="animate-spin text-2xl"></LoadingIcon>
        </div>
      </When>
      <When if={!typing && Boolean(data)}>
        {() => (
          <TranslationContent
            data={data as IFetchDataResponse}
            originText={textTranslate}
          ></TranslationContent>
        )}
      </When>
    </Popup>
  );
};

const TranslationInput: IReactProps<{
  setText: (s: string) => void;
}> = ({ setText }) => {
  const [value, valueSet] = useState('');

  return (
    <div className="p-4">
      <h2 className="mb-4 text-center text-2xl font-semibold">Translate</h2>
      <input
        type="text"
        className="input text-center"
        autoFocus={true}
        onKeyDown={(e) => {
          if (matchShortCut(e, SHORTCUT_ACCEPT) && value.trim().length > 0)
            setText && setText(value);
        }}
        placeholder="Type what you want to translate"
        value={value}
        onChange={(e) => valueSet(e.target.value)}
      />
    </div>
  );
};

export default TranslationPopup;
