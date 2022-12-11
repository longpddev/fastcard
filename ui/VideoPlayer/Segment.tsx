'use client';

import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import React from 'react';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useRef } from 'react';
import { IReactProps } from '@/interfaces/common';
import { ISegment } from './function';
const Segment: IReactProps<{
  segment: ISegment;
}> = ({ segment }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!segment.isActive()) return;
    if (!element) return;

    scrollIntoView(element, {
      scrollMode: 'if-needed',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [segment.isActive()]);
  return (
    <div
      ref={ref}
      className={clsx('mb-2 rounded-sm px-2 py-1', {
        'bg-slate-800 text-sky-300': segment.isActive(),
        'cursor-pointer opacity-50 hover:bg-slate-700 hover:opacity-80':
          !segment.isActive(),
      })}
      onClick={() => !segment.isActive() && segment.activeMe()}
    >
      <span
        className="group:text-slate-700 cursor-pointer text-orange-400 hover:underline"
        onClick={() => segment.activeMe()}
      >
        {segment.timeFormat}
      </span>
      &nbsp;&nbsp;
      <span className="group:text-slate-800">{segment.text}</span>
    </div>
  );
};

export default Segment;
