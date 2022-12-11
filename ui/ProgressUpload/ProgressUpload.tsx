'use client';

import { IReactProps } from '@/interfaces/common';
import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';

const ProgressUpload: IReactProps<{
  processing: number;
  speed: number;
  loaded: number;
  total: number;
}> = ({ processing, speed, loaded, total, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {}, []);
  return (
    <div {...props}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-600">
        <div
          className="animate-progress absolute left-0 top-0 bottom-0 h-full w-0 overflow-hidden rounded-full bg-sky-400 transition-all before:opacity-50"
          style={{
            width: `${processing}%`,
          }}
          ref={ref}
        ></div>
      </div>
      <div className="relative mt-2 flex flex-wrap">
        <p className="absolute top-0 left-0">{loaded}</p>
        <p className="mx-auto text-center">
          <span className="text-slate-400">{speed}</span>/s{' '}
          <span className="text-xl text-green-400">{processing}</span>%
        </p>
        <p className="absolute top-0 right-0">{total}</p>
      </div>
    </div>
  );
};

export default ProgressUpload;
