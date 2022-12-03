'use client';

import React from 'react';
import CardBase from './CardBase';
import { IReactProps } from '@/interfaces/common';

const CardAnswer: IReactProps = (props) => {
  const title: JSX.Element = (
    <h2 className="border-t-2 border-b border-slate-700 border-t-blue-500 py-2 text-center text-2xl">
      Answer
    </h2>
  );
  return <CardBase {...props} title={title} />;
};

export default CardAnswer;
