'use client';

import {
  ATTRIBUTE_SHORTCUT_BUTTON,
  SHORTCUT_ESCAPE,
  SHORTCUT_TOGGLE_GUILD_SHORTCUT,
} from '@/constants/index';
import useShortcut from '@/hooks/useShortcut';
import React, { useEffect, useMemo, useState } from 'react';
import OutsideTheApp from '@/ui/OutsideTheApp';
import { extractNameShortCut } from '@/functions/common';
import TooltipShortCut from './TooltipShortCut';

type DOMRectReadable = {
  -readonly [K in keyof Omit<DOMRect, 'toJSON'>]: DOMRect[K];
};

function getAllShortCutButton() {
  if (typeof document === 'undefined') return [];
  const rootElement = document.fullscreenElement || document.body;
  const els = Array.from(
    rootElement.querySelectorAll(`[${ATTRIBUTE_SHORTCUT_BUTTON}]`),
  );
  const rectEls = els.map((el) => {
    const attr = el.getAttribute(ATTRIBUTE_SHORTCUT_BUTTON);
    if (!attr) return;
    const { keyName, specialKey } = extractNameShortCut(attr);

    const rect = el.getBoundingClientRect();
    const rectClone = {} as DOMRectReadable;
    for (const key in rect) {
      const item = rect[key as keyof typeof rect];
      if (typeof item === 'function') continue;
      rectClone[key as keyof typeof rectClone] = item;
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
  const [listItem, listItemSet] = useState<
    ReturnType<typeof getAllShortCutButton>
  >([]);

  useEffect(() => {
    listItemSet(getAllShortCutButton());
  }, [open]);
  if (!open) return null;

  return (
    <OutsideTheApp>
      <div className="fixed inset-0 z-50 h-full w-full">
        <div
          className="absolute inset-0 h-full w-full bg-black opacity-40"
          onClick={() => openSet(false)}
        ></div>
        {listItem.map((item, i) =>
          item ? (
            <TooltipShortCut
              {...item}
              key={i}
              active={active === -1 || active === i}
              onActive={(status) => {
                status ? activeSet(i) : activeSet(-1);
              }}
            />
          ) : null,
        )}
      </div>
    </OutsideTheApp>
  );
};

export default PopupShortCutDetailMain;
