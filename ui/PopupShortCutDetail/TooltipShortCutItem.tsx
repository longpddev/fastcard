'use client';

import { useLayoutEffect } from 'react';
import { useRef, useState } from 'react';
import { clsx } from 'clsx';
import { KEY_NAME, SPECIAL_KEY } from '@/constants/index';
import { IReactProps } from '@/interfaces/common';
let isMac = false;

if (typeof navigator !== 'undefined') {
  isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}
const KEY_LABEL_MAPPING = {
  [SPECIAL_KEY.Command]: isMac ? 'command' : 'window',
  [SPECIAL_KEY.Ctrl]: isMac ? 'control' : 'Ctrl',
  [SPECIAL_KEY.Shift]: isMac ? 'shift' : 'shift',
  [SPECIAL_KEY.Alt]: isMac ? 'alt' : 'option',
  [KEY_NAME.Enter]: isMac ? 'return' : 'enter',
};

interface ITooltipShortCutItemProps {
  keyName: string;
  specialKey: string | undefined;
  space?: number;
  onActive: (s: boolean) => void;
  anchorWidth: number;
  anchorHeight: number;
}

const TooltipShortCutItem: IReactProps<ITooltipShortCutItemProps> = ({
  keyName,
  specialKey,
  space = 10,
  onActive,
  anchorWidth,
  anchorHeight,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, positionSet] = useState<{
    top: number;
    left: string | number;
  }>({
    top: 0,
    left: `calc(${anchorWidth}px + ${space}px)`,
  });

  const [arrow, arrowSet] = useState({
    top: true,
    left: true,
  });
  const forward = useRef(
    {} as {
      position: typeof position;
      space: typeof space;
      arrowSet: typeof arrowSet;
      arrow: typeof arrow;
    },
  );
  forward.current = {
    position,
    space,
    arrowSet,
    arrow,
  };
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { innerWidth, innerHeight } = window;
    const rect = el.getBoundingClientRect();
    const fw = forward.current;
    const newPosition = { ...fw.position };
    if (innerWidth < rect.right) {
      newPosition.left = -(rect.width + fw.space);
      fw.arrowSet({ ...fw.arrow, left: false });
    } else {
      fw.arrowSet({ ...fw.arrow, left: true });
    }

    positionSet(newPosition);
  }, []);
  return (
    <div
      className={clsx(
        'z-1 absolute whitespace-nowrap rounded-md bg-sky-800 px-2 py-1 text-slate-50 ',
        'before:absolute before:text-sky-800',
        {
          'triangle-left': arrow.left,
          'triangle-right': !arrow.left,
        },
      )}
      onPointerEnter={() => {
        onActive && onActive(true);
      }}
      onPointerLeave={() => {
        onActive && onActive(false);
      }}
      style={{ ...position }}
      ref={ref}
    >
      <span className="absolute "></span>
      {specialKey && specialKey in KEY_LABEL_MAPPING
        ? KEY_LABEL_MAPPING[specialKey as keyof typeof KEY_LABEL_MAPPING] +
          ' + '
        : ''}
      {keyName in KEY_LABEL_MAPPING
        ? KEY_LABEL_MAPPING[keyName as keyof typeof KEY_LABEL_MAPPING]
        : keyName}
    </div>
  );
};

export default TooltipShortCutItem;
