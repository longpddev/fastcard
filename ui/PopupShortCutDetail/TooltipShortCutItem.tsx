'use client';

import { useLayoutEffect } from 'react';
import { useRef, useState } from 'react';
import { clsx } from 'clsx';
import { KEY_NAME, SPECIAL_KEY } from '@/constants/index';
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const KEY_LABEL_MAPPING = {
  [SPECIAL_KEY.Command]: isMac ? 'command' : 'window',
  [SPECIAL_KEY.Ctrl]: isMac ? 'control' : 'Ctrl',
  [SPECIAL_KEY.Shift]: isMac ? 'shift' : 'shift',
  [SPECIAL_KEY.Alt]: isMac ? 'alt' : 'option',
  [KEY_NAME.Enter]: isMac ? 'return' : 'enter',
};

const TooltipShortCutItem = ({
  keyName,
  specialKey,
  space = 10,
  onActive,
  anchorWidth,
  anchorHeight,
}) => {
  const ref = useRef();
  const [position, positionSet] = useState({
    top: 0,
    left: `calc(${anchorWidth}px + ${space}px)`,
  });

  const [arrow, arrowSet] = useState({
    top: true,
    left: true,
  });
  const forward = useRef();
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
      {specialKey in KEY_LABEL_MAPPING
        ? KEY_LABEL_MAPPING[specialKey] + ' + '
        : ''}
      {keyName in KEY_LABEL_MAPPING ? [KEY_LABEL_MAPPING[keyName]] : keyName}
    </div>
  );
};

export default TooltipShortCutItem;
