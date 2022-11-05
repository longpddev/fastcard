/**
 * @typedef {string} ShortcutName format is commandkey; + namekey
 * @typedef {[ShortcutName, (e: KeyboardEvent) => void;]} IShortcut
 */

import { SPECIAL_KEY } from "@/constants/index";
import { extractNameShortCut } from "@/functions/common";
import { useEffect } from "react";

/** @type {IShortcut[]} */
let listShortCut = [];
document.addEventListener("keydown", (e) => {
  listShortCut.forEach((shortcut) => {
    const [name, fn] = shortcut;
    const { keyName, specialKey } = extractNameShortCut(name);
    if (specialKey) {
      switch (specialKey) {
        case SPECIAL_KEY.Command:
          if (!e.metaKey) return;
          break;
        case SPECIAL_KEY.Alt:
          if (!e.altKey) return;
          break;
        case SPECIAL_KEY.Ctrl:
          if (!e.ctrlKey) return;
          break;
        case SPECIAL_KEY.Shift:
          if (!e.shiftKey) return;
          break;
        default:
          return;
      }
    }

    if (keyName !== e.key) return;

    fn(e);
  });
});

window.listShortCut = listShortCut;
const register = (shortcutName, fn) => {
  const arr = [shortcutName, fn];
  listShortCut.push(arr);

  return () => {
    listShortCut = listShortCut.filter((item) => item !== arr);
    window.listShortCut = listShortCut;
  };
};
export default function useShortcut(shortcutName, fn, arr = []) {
  useEffect(() => {
    if (!shortcutName) return;
    return register(shortcutName, fn);
  }, [...arr, shortcutName]);
}
