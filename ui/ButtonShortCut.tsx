'use client';

import { ATTRIBUTE_SHORTCUT_BUTTON } from '@/constants/index';
import useShortcut from '@/hooks/useShortcut';
import { IReactProps } from '@/interfaces/common';
import React, { useEffect, useRef } from 'react';

const ButtonShortCut: IReactProps<{
  shortcut: string;
  onClickClassName?: string;
  onClick: () => void;
}> = ({ onClick, shortcut = '', onClickClassName = '', ...props }) => {
  if (typeof shortcut !== 'string') throw new Error('shortcut must is string');

  const ref = useRef<HTMLButtonElement>(null);
  const handleClick = useRef({} as () => void);
  handleClick.current = () => {
    const el = /** @type { HTMLButtonElement }  */ ref.current;

    if (el) {
      el.classList.add('animate-click-button');

      if (onClickClassName) {
        el.classList.add(onClickClassName);
      }
    }

    onClick();
  };

  useShortcut(shortcut, () => {
    handleClick.current();
  });

  useEffect(() => {
    const el = /** @type { HTMLButtonElement }  */ ref.current;

    if (!el) return;
    const handleAnimationEnd = () => {
      const classList = el.classList;
      classList.contains('animate-click-button') &&
        classList.remove('animate-click-button');

      if (classList.contains('animate-click-button')) {
        classList.remove('animate-click-button');
        if (onClickClassName) classList.remove(onClickClassName);
      }
    };
    el.addEventListener('animationend', handleAnimationEnd);

    return () => el.removeEventListener('animationend', handleAnimationEnd);
  }, []);
  return (
    <button
      ref={ref}
      {...{ [ATTRIBUTE_SHORTCUT_BUTTON]: shortcut }}
      onClick={handleClick.current}
      {...props}
    ></button>
  );
};

export default ButtonShortCut;
