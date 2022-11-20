import {
  ATTRIBUTE_SHORTCUT_BUTTON,
  SHORTCUT_ESCAPE,
  SHORTCUT_TOGGLE_GUILD_SHORTCUT,
} from "@/constants/index";
import useShortcut from "@hooks/useShortcut";
import React, { useMemo, useState } from "react";
import OutsideTheApp from "@components/OutsideTheApp";
import { extractNameShortCut } from "@/functions/common";
import TooltipShortCut from "./TooltipShortCut";

function getAllShortCutButton() {
  const rootElement = document.fullscreenElement || document.body;
  const els = Array.from(
    rootElement.querySelectorAll(`[${ATTRIBUTE_SHORTCUT_BUTTON}]`)
  );
  const rectEls = els.map((el) => {
    const attr = el.getAttribute(ATTRIBUTE_SHORTCUT_BUTTON);
    if (!attr) return;
    const { keyName, specialKey } = extractNameShortCut(attr);

    const rect = el.getBoundingClientRect();
    const rectClone = {};
    for (const key in el.getBoundingClientRect()) {
      if (typeof rect[key] === "function") continue;
      rectClone[key] = rect[key];
    }
    return {
      ...rectClone,
      keyName,
      specialKey,
    };
  });

  return rectEls;
}

const PopupShortCutDetailMain = () => {
  const [open, openSet] = useState(false);
  const [active, activeSet] = useState(-1);
  useShortcut(SHORTCUT_TOGGLE_GUILD_SHORTCUT, () => openSet((prev) => !prev));
  useShortcut(SHORTCUT_ESCAPE, () => openSet(false));
  const listItem = useMemo(() => getAllShortCutButton(), [open]);
  if (!open) return null;

  return (
    <OutsideTheApp>
      <div className="fixed z-50 inset-0 w-full h-full">
        <div
          className="bg-black absolute inset-0 w-full h-full opacity-40"
          onClick={() => openSet(false)}
        ></div>
        {listItem.map((item, i) => (
          <TooltipShortCut
            {...item}
            key={i}
            active={active === -1 || active === i}
            onActive={(status) => {
              console.log(status);
              status ? activeSet(i) : activeSet(-1);
            }}
          />
        ))}
      </div>
    </OutsideTheApp>
  );
};

export default PopupShortCutDetailMain;
