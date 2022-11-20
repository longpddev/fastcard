/**
 * @typedef {string} ShortcutName format is commandkey; + namekey
 * @typedef {[ShortcutName, (e: KeyboardEvent) => void;]} IShortcut
 */

import { matchShortCut } from "@/functions/common";
import { useEffect, useRef } from "react";

/**
 *
 * @param {{get: IShortcut[]}} shortcuts
 * @param { KeyboardEvent } event
 */
function initHandle(shortcuts, event) {
  shortcuts.get.forEach((shortcut) => {
    const [shortCutName, fn, preventDefault] = shortcut;
    if (!matchShortCut(event, shortCutName)) return;

    if (preventDefault) {
      event.preventDefault();
    }
    fn(event);
  });
}

/**
 *
 * @param { string } shortcutName
 * @param {(e: KeyboardEvent) => void} fn
 * @param {{get: IShortcut[]}} list
 * @param { boolean } preventDefault
 * @returns { () => void } unregister
 */
const register = (shortcutName, fn, list, preventDefault) => {
  const arr = [shortcutName, fn, preventDefault];
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

export default function useShortcut(shortcutName, fn, preventDefault = true) {
  const forward = useRef();
  forward.current = {
    fn,
  };
  useEffect(() => {
    if (!shortcutName) return;
    const handle = function () {
      forward.current.fn(...arguments);
    };
    return register(shortcutName, handle, listKeydownShortCut, preventDefault);
  }, [shortcutName]);
}

export function useKeyupShortcut(shortcutName, fn, preventDefault = true) {
  const forward = useRef();
  forward.current = {
    fn,
  };
  useEffect(() => {
    if (!shortcutName) return;
    const handle = function () {
      forward.current.fn(...arguments);
    };
    return register(shortcutName, handle, listKeyupShortCut, preventDefault);
  }, [shortcutName]);
}
