'use client';

import React from 'react';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useRef } from 'react';
const Segment = ({ segment }) => {
  const ref = useRef();
  useEffect(() => {
    if (!segment.isActive() || !ref.current) return;
    ref.current.scrollIntoViewIfNeeded && ref.current.scrollIntoViewIfNeeded();
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
