import clsx from "clsx";
import React from "react";
import { CARD_LEAN_TYPE } from "../../constants";
import useShortcut from "@hooks/useShortcut";
import { KEY_NAME, SPECIAL_KEY } from "@/constants";
import ButtonShortCut from "@components/ButtonShortCut";

export const ButtonControl = ({ isFront, isFrontSet, handleAction }) => {
  const isMobileLayout = window.innerWidth <= 480;

  useShortcut(SPECIAL_KEY.Ctrl + "f", (e) => {
    e.preventDefault();
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
          shortcut={SPECIAL_KEY.Ctrl + KEY_NAME.Enter}
          className="button text-sky-300 text-xl"
          onClick={() => isFrontSet(false)}
        >
          View results
        </ButtonShortCut>
      ) : (
        <>
          <ButtonShortCut
            title="SPACE_BAR+r"
            shortcut={SPECIAL_KEY.Ctrl + "r"}
            key={CARD_LEAN_TYPE.repeat}
            onClick={() => {
              handleAction(CARD_LEAN_TYPE.repeat);
            }}
            className="text-stone-400 text-xl button"
          >
            Repeat
          </ButtonShortCut>
          <ButtonShortCut
            title="SPACE_BAR+g"
            shortcut={SPECIAL_KEY.Ctrl + "g"}
            key={CARD_LEAN_TYPE.good}
            onClick={() => {
              handleAction(CARD_LEAN_TYPE.good);
            }}
            className="text-green-400 text-xl button"
          >
            Good
          </ButtonShortCut>
          <ButtonShortCut
            title="SPACE_BAR+h"
            shortcut={SPECIAL_KEY.Ctrl + "h"}
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
