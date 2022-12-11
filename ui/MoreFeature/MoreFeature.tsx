'use client';

import { IReactProps } from '@/interfaces/common';
import clsx from 'clsx';
import React, { useLayoutEffect } from 'react';
import { useId } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import IconCircle from '../IconCircle';

const MoreFeature: IReactProps = ({ children, className }) => {
  const [open, openSet] = useState(false);
  const idRef = useRef<string>();
  if (!idRef.current)
    idRef.current = 'element' + Math.random().toString(32).slice(2, 7);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest(`.${idRef.current}`)) {
        openSet(false);
      }
    };
    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
  }, []);
  return (
    <div ref={ref} className={clsx(className, idRef.current)}>
      <IconCircle
        size="md"
        onClick={() => openSet(!open)}
        className={clsx('fa-solid fa-ellipsis-vertical transition-all', {
          'rotate-90': open,
        })}
      ></IconCircle>

      {open && <MoreFeatureContent>{children}</MoreFeatureContent>}
    </div>
  );
};

const MoreFeatureContent: IReactProps = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [leftOrRight, leftOrRightSet] = useState('left');
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isOverlap = el.getBoundingClientRect().right > window.innerWidth;
    if (isOverlap) leftOrRightSet('right');
  }, []);
  return (
    <div
      ref={ref}
      className={clsx(
        'absolute top-[100%] z-10 mt-1 overflow-hidden rounded-md bg-slate-600 py-1',
        {
          'right-0': leftOrRight === 'right',
          'left-0': leftOrRight === 'left',
        },
      )}
    >
      {children}
    </div>
  );
};

export default MoreFeature;
