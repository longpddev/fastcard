import clsx from "clsx";
import React from "react";
import { CARD_LEAN_TYPE } from "../../constants";
import { GlobalKeys } from "../ShortCutClick";

export const ButtonControl = ({ isFront, isFrontSet, handleAction }) => {
  const isMobileLayout = window.innerWidth <= 480;
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
        <GlobalKeys
          handlers={{
            Enter: () => isFrontSet(false),
          }}
        >
          <button
            className="button text-sky-300"
            onClick={() => isFrontSet(false)}
          >
            View results
          </button>
        </GlobalKeys>
      ) : (
        <GlobalKeys
          handlers={{
            "SPACE_BAR+r": () => handleAction(CARD_LEAN_TYPE.repeat),
            "SPACE_BAR+g": () => handleAction(CARD_LEAN_TYPE.good),
            Enter: () => handleAction(CARD_LEAN_TYPE.good),
            "SPACE_BAR+h": () => handleAction(CARD_LEAN_TYPE.hard),
          }}
        >
          <button
            title="SPACE_BAR+r"
            key={CARD_LEAN_TYPE.repeat}
            onClick={() => {
              handleAction(CARD_LEAN_TYPE.repeat);
            }}
            className="text-stone-400 text-xl button"
          >
            Repeat
          </button>
          <button
            title="SPACE_BAR+g"
            key={CARD_LEAN_TYPE.good}
            onClick={() => {
              handleAction(CARD_LEAN_TYPE.good);
            }}
            className="text-green-400 text-xl button"
          >
            Good
          </button>
          <button
            title="SPACE_BAR+h"
            key={CARD_LEAN_TYPE.hard}
            onClick={() => {
              handleAction(CARD_LEAN_TYPE.hard);
            }}
            className="text-red-400 text-xl button"
          >
            Hard
          </button>
        </GlobalKeys>
      )}
    </div>
  );
};

export default ButtonControl;
