'use client';

import { IReactProps } from '@/interfaces/common';
import clsx from 'clsx';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import Markdown from './Markdown';

const EditorMarkdown: IReactProps<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange, placeholder, className, ...props }) => {
  return (
    <div className={clsx(className, 'flex flex-wrap')} {...props}>
      <textarea
        className="input w-full min-w-[300px] flex-1 md:w-1/2"
        cols={30}
        rows={10}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
      <Markdown className="block-down w-full min-w-[300px] flex-1 rounded-md p-2 md:w-1/2">
        {value || 'Preview'}
      </Markdown>
    </div>
  );
};

export default EditorMarkdown;
