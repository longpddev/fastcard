import clsx from "clsx";
import React from "react";
import { CARD_LEAN_TYPE } from "../../constants";
import useShortcut from "@hooks/useShortcut";
import {
  SHORTCUT_CARD_ACTION_GOOD,
  SHORTCUT_CARD_ACTION_HARD,
  SHORTCUT_CARD_ACTION_REPEAT,
  SHORTCUT_CARD_FLIP,
  SHORTCUT_CARD_VIEW_RESULT,
} from "@/constants";
import ButtonShortCut from "@components/ButtonShortCut";

export const ButtonControl = ({ isFront, isFrontSet, handleAction }) => {
  const isMobileLayout = window.innerWidth <= 480;

  useShortcut(SHORTCUT_CARD_FLIP, () => {
    isFrontSet((prev) => !prev);
  });

  return (
    <div
      className={clsx(
        "flex gap-6 justify-center items-center shadow-top",
        isMobileLayout
          ? "fixed bottom-0 left-0 right-0 w-full p-4 bg-slate-800 "
          : "pt-10 mt-10"
      )}
    >
      {isFront ? (
        <ButtonShortCut
          shortcut={SHORTCUT_CARD_VIEW_RESULT}
          className="button text-sky-300 text-xl"
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
            className="text-stone-400 text-xl button"
          >
            Repeat
          </ButtonShortCut>
          <ButtonShortCut
            shortcut={SHORTCUT_CARD_ACTION_GOOD}
            key={CARD_LEAN_TYPE.good}
            onClick={() => {
              handleAction(CARD_LEAN_TYPE.good);
            }}
            className="text-green-400 text-xl button"
          >
            Good
          </ButtonShortCut>
          <ButtonShortCut
            shortcut={SHORTCUT_CARD_ACTION_HARD}
            key={CARD_LEAN_TYPE.hard}
            onClick={() => {
              handleAction(CARD_LEAN_TYPE.hard);
            }}
            className="text-red-400 text-xl button"
          >
            Hard
          </ButtonShortCut>
        </>
      )}
    </div>
  );
};

export default ButtonControl;
