/**
 * @typedef {string} ShortcutName format is commandkey; + namekey
 * @typedef {[ShortcutName, (e: KeyboardEvent) => void;]} IShortcut
 */

import { SPECIAL_KEY } from "@/constants/index";
import { extractNameShortCut } from "@/functions/common";
import { useEffect, useRef } from "react";

/**
 *
 * @param {{get: IShortcut[]}} shortcuts
 * @param { KeyboardEvent } event
 */
function initHandle(shortcuts, event) {
  shortcuts.get.forEach((shortcut) => {
    const [name, fn] = shortcut;
    const { keyName, specialKey } = extractNameShortCut(name);
    if (specialKey) {
      switch (specialKey) {
        case SPECIAL_KEY.Command:
          if (!event.metaKey) return;
          break;
        case SPECIAL_KEY.Alt:
          if (!event.altKey) return;
          break;
        case SPECIAL_KEY.Ctrl:
          if (!event.ctrlKey) return;
          break;
        case SPECIAL_KEY.Shift:
          if (!event.shiftKey) return;
          break;
        default:
          return;
      }
    }

    if (keyName !== event.key) return;

    fn(event);
  });
}

/**
 *
 * @param { string } shortcutName
 * @param {(e: KeyboardEvent) => void} fn
 * @param {{get: IShortcut[]}} list
 * @returns { () => void } unregister
 */
const register = (shortcutName, fn, list) => {
  const arr = [shortcutName, fn];
  list.get.push(arr);

  return () => {
    list.get = list.get.filter((item) => item !== arr);
  };
};

/** @type {{get: IShortcut[]}} */
let listKeydownShortCut = {
  get: [],
};

document.addEventListener("keydown", (e) => {
  initHandle(listKeydownShortCut, e);
});

/** @type {{get: IShortcut[]}} */
let listKeyupShortCut = {
  get: [],
};
document.addEventListener("keyup", (e) => {
  initHandle(listKeyupShortCut, e);
});

export default function useShortcut(shortcutName, fn, arr = []) {
  const forward = useRef();
  forward.current = {
    fn,
  };
  useEffect(() => {
    if (!shortcutName) return;
    const handle = function () {
      forward.current.fn(...arguments);
    };
    return register(shortcutName, handle, listKeydownShortCut);
  }, [...arr, shortcutName]);
}

export function useKeyupShortcut(shortcutName, fn, arr = []) {
  const forward = useRef();
  forward.current = {
    fn,
  };
  useEffect(() => {
    if (!shortcutName) return;
    const handle = function () {
      forward.current.fn(...arguments);
    };
    return register(shortcutName, handle, listKeyupShortCut);
  }, [...arr, shortcutName]);
}
