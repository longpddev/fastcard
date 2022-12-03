'use client';

import React from 'react';
import CardBase from './CardBase';
import { IReactProps } from '@/interfaces/common';

const CardExplain: IReactProps = (props) => {
  const title = (
    <h2 className="border-t-2 border-b border-slate-700 border-t-green-500 py-2 text-center text-2xl">
      Explain
    </h2>
  );
  return <CardBase {...props} title={title} />;
};

export default CardExplain;
