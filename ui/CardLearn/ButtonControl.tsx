'use client';

import clsx from 'clsx';
import React from 'react';
import { CARD_LEAN_TYPE } from '@/constants/index';
import useShortcut from '@/hooks/useShortcut';
import {
  SHORTCUT_CARD_ACTION_GOOD,
  SHORTCUT_CARD_ACTION_HARD,
  SHORTCUT_CARD_ACTION_REPEAT,
  SHORTCUT_CARD_FLIP,
  SHORTCUT_CARD_VIEW_RESULT,
} from '@/constants/index';
import ButtonShortCut from '@/ui/ButtonShortCut';
import { IReactProps, IReactSetState } from '@/interfaces/common';

export interface IButtonControlProps {
  isFront: boolean;
  isFrontSet: IReactSetState<boolean>;
  handleAction: (str: string) => void;
}
export const ButtonControl: IReactProps<IButtonControlProps> = ({
  isFront,
  isFrontSet,
  handleAction,
}) => {
  const isMobileLayout = window.innerWidth <= 480;

  useShortcut(SHORTCUT_CARD_FLIP, () => {
    isFrontSet((prev) => !prev);
  });

  return (
    <div
      className={clsx(
        'shadow-top flex items-center justify-center gap-6',
        isMobileLayout
          ? 'fixed bottom-0 left-0 right-0 w-full bg-slate-800 p-4 '
          : 'mt-10 pt-10',
      )}
    >
      {isFront ? (
        <ButtonShortCut
          shortcut={SHORTCUT_CARD_VIEW_RESULT}
          className="button text-xl text-sky-300"
          onClick={() => isFrontSet(false)}
        >
          View results
        </ButtonShortCut>
      ) : (
        <>
          <ButtonShortCut
            shortcut={SHORTCUT_CARD_ACTION_REPEAT}
            key={CARD_LEAN_TYPE.repeat}
            onClick={() => {
              handleAction(CARD_LEAN_TYPE.repeat);
            }}
            className="button text-xl text-stone-400"
          >
            Repeat
          </ButtonShortCut>
          <ButtonShortCut
            shortcut={SHORTCUT_CARD_ACTION_GOOD}
            key={CARD_LEAN_TYPE.good}
            onClick={() => {
              handleAction(CARD_LEAN_TYPE.good);
            }}
            className="button text-xl text-green-400"
          >
            Good
          </ButtonShortCut>
          <ButtonShortCut
            shortcut={SHORTCUT_CARD_ACTION_HARD}
            key={CARD_LEAN_TYPE.hard}
            onClick={() => {
              handleAction(CARD_LEAN_TYPE.hard);
            }}
            className="button text-xl text-red-400"
          >
            Hard
          </ButtonShortCut>
        </>
      )}
    </div>
  );
};

export default ButtonControl;
