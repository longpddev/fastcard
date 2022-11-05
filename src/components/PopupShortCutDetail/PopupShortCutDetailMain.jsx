import { ATTRIBUTE_SHORTCUT_BUTTON, SPECIAL_KEY } from "@/constants/index";
import useShortcut from "@hooks/useShortcut";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import OutsideTheApp from "@components/OutsideTheApp";
import { extractNameShortCut } from "@/functions/common";
import TooltipShortCut from "./TooltipShortCut";

function getAllShortCutButton() {
  const els = Array.from(
    document.querySelectorAll(`[${ATTRIBUTE_SHORTCUT_BUTTON}]`)
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
  console.log(rectEls);
  return rectEls;
}

const PopupShortCutDetailMain = () => {
  const [open, openSet] = useState(false);
  const [active, activeSet] = useState(-1);
  useShortcut(SPECIAL_KEY.Command + "p", (e) => {
    e.preventDefault();
    openSet((prev) => !prev);
  });
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
