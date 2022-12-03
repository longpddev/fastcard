'use client';

import { IReactProps } from '@/interfaces/common';
import React, { HTMLAttributes } from 'react';
interface ICard {
  className: string;
}

const Card: IReactProps<ICard> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`block-up overflow-hidden rounded-md bg-slate-800 ${className}`}
      {...props}
    >
      <div className="shadow-top h-full rounded-md">{children}</div>
    </div>
  );
};

export default Card;
