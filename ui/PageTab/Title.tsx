'use client';

import React from 'react';
import { useContext } from './context';
import { IReactProps } from '@/interfaces/common';
import { titlePage } from '../../../language_card/src/functions/common';

const Title: IReactProps<{
  tabKey: string;
}> = ({ tabKey, children }) => {
  const { tabActive, setTabActive, typeStep, tabList } = useContext();
  const tabKeyString = tabKey.toString();
  // public tabkey
  if (!tabList.current.includes(tabKeyString))
    tabList.current.push(tabKeyString);

  return (
    <div
      tabIndex={1}
      className={`relative cursor-pointer border-b-[3px] border-transparent px-4 py-1 text-lg before:absolute before:inset-0 before:h-full before:w-full  md:border-l-[3px] md:border-b-0 ${
        tabKeyString === tabActive
          ? 'border-blue-400  before:bg-blue-600 before:opacity-20 md:before:bg-blue-600'
          : 'hover:border-blue-600 hover:border-opacity-10  hover:before:bg-blue-600 hover:before:opacity-10'
      } ${typeStep ? 'cursor-not-allowed' : ''}`}
      onClick={() => !typeStep && setTabActive(tabKeyString)}
    >
      {children}
    </div>
  );
};

export default Title;
