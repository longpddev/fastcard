'use client';

import { matchShortCut } from '@/functions/common';
import { useEffect, useRef } from 'react';

type IShortcutName = string;
type IShortcut = [IShortcutName, (e: KeyboardEvent) => void, boolean];
type IHandleEvent = (e: KeyboardEvent) => void;
type IShortcutList = {
  get: Array<IShortcut>;
};

function initHandle(shortcuts: IShortcutList, event: KeyboardEvent) {
  shortcuts.get.forEach((shortcut) => {
    const [shortCutName, fn, preventDefault] = shortcut;
    if (!matchShortCut(event, shortCutName)) return;

    if (preventDefault) {
      event.preventDefault();
    }
    fn(event);
  });
}

const register = (
  shortcutName: string,
  fn: (e: KeyboardEvent) => void,
  list: { get: IShortcut[] },
  preventDefault: boolean,
) => {
  const arr: IShortcut = [shortcutName, fn, preventDefault];
  list.get.push(arr);

  return () => {
    list.get = list.get.filter((item) => item !== arr);
  };
};

let listKeydownShortCut: IShortcutList = {
  get: [],
};
let listKeyupShortCut: IShortcutList = {
  get: [],
};

if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    initHandle(listKeydownShortCut, e);
  });

  document.addEventListener('keyup', (e) => {
    initHandle(listKeyupShortCut, e);
  });
}

export default function useShortcut(
  shortcutName: string,
  fn: IHandleEvent,
  preventDefault = true,
) {
  const forward = useRef<{ fn: IHandleEvent }>();
  forward.current = {
    fn,
  };
  useEffect(() => {
    if (!shortcutName) return;
    const handle: IHandleEvent = (e) => {
      forward.current?.fn(e);
    };
    return register(shortcutName, handle, listKeydownShortCut, preventDefault);
  }, [shortcutName]);
}

export function useKeyupShortcut(
  shortcutName: string,
  fn: IHandleEvent,
  preventDefault = true,
) {
  const forward = useRef<{ fn: IHandleEvent }>();
  forward.current = {
    fn,
  };
  useEffect(() => {
    if (!shortcutName) return;
    const handle: IHandleEvent = (e) => {
      forward.current?.fn(e);
    };
    return register(shortcutName, handle, listKeyupShortCut, preventDefault);
  }, [shortcutName]);
}
