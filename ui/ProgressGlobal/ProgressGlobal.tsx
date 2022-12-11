'use client';

import React, { useEffect, useRef, useState } from 'react';
import { animate } from '@/functions/common';
import Emitter, { EmitterIdle } from '../../helpers/emitter';

export const progressEmitter = EmitterIdle();
export const progressDone = () => progressEmitter.emit('end');
export const progressStart = () => progressEmitter.emit('start');

// use in finally of promise
export const progressWatchPromise = () => {
  progressStart();
  return () => progressDone();
};

const ProgressGlobal = () => {
  const [isDone, isDoneSet] = useState(false);
  const [isShow, isShowSet] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const process = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = () =>
      (el.style.transform = `translateX(${process.current - 100}%)`);

    if (!isShow) {
      process.current = 0;
      render();
      return;
    }
    const stopAnimate = animate(() => {
      let factor = 0.1;

      if (process.current >= 100) {
        process.current = 100;
        render();
        isShowSet(false);
        return false;
      }

      if (isDone) {
        factor = 3;
      } else if (process.current > 90) {
        return false;
      }
      process.current += factor;
      render();
      return true;
    });

    return () => {
      stopAnimate();
    };
  }, [isDone, isShow]);

  useEffect(() => {
    const handleStart = () => {
      isDoneSet(false);
      isShowSet(true);
    };
    const handleEnd = () => {
      isDoneSet(true);
    };
    progressEmitter.on('end', handleEnd);
    progressEmitter.on('start', handleStart);

    return () => {
      progressEmitter.off('end', handleEnd);
      progressEmitter.off('start', handleStart);
    };
  });
  return (
    <div className="fixed top-0 left-0 z-50 h-[2px] w-full overflow-hidden bg-transparent">
      <div
        className="animate-progress translate-x-100 absolute top-0 left-0 z-10 h-full w-full overflow-hidden bg-sky-400"
        ref={ref}
      ></div>
    </div>
  );
};

export default ProgressGlobal;
