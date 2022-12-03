'use client';

import clsx from 'clsx';
import React from 'react';

const IconCircle = ({
  className = '',
  wrapClass = '',
  size = 'lg',
  ...props
}) => {
  return (
    <div
      className={clsx(
        `translate-all relative h-10 w-10 cursor-pointer rounded-full bg-slate-700 hover:bg-slate-600`,
        wrapClass,
        {
          'h-12 w-12': size === 'xl',
          'h-10 w-10': size === 'lg',
          'h-7 w-7': size === 'md',
          'h-5 w-5': size === 'sm',
        },
      )}
      {...props}
    >
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
        <i className={`${className}`}></i>
      </div>
    </div>
  );
};

export default IconCircle;
