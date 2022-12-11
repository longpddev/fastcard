'use client';

import { IReactProps } from '@/interfaces/common';
import React, { Children } from 'react';

const HeaderPage: IReactProps<{
  title: string;
}> = ({ title, children }) => {
  const newChild = Children.map(children, (child) => (
    <li className="ml-2">{child}</li>
  ));
  return (
    <div className="mb-6 flex items-center border-b-2 border-slate-800 pb-4">
      <h1 className="text-center text-2xl font-medium text-slate-200">
        {title}
      </h1>
      <ul className="ml-auto flex">{newChild}</ul>
    </div>
  );
};

export default HeaderPage;
