'use client';

import React from 'react';
import CardBase, { ICardBaseProps } from './CardBase';
import { IReactProps } from '@/interfaces/common';

const CardQuestion: IReactProps<{ children: string }> = ({
  children,
  ...props
}) => {
  const title = (
    <h2 className="border-t-2 border-b border-slate-700 border-t-orange-500 py-2 text-center text-2xl">
      Question
    </h2>
  );
  return (
    <CardBase {...props} title={title}>
      {children}
    </CardBase>
  );
};

export default CardQuestion;
