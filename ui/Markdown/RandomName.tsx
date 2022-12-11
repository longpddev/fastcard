'use client';

import { IReactProps } from '@/interfaces/common';
import clsx from 'clsx';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const RandomName: IReactProps<{
  isPure?: boolean;
  children: string;
}> = ({ children, className = '', isPure = false, ...props }) => (
  <ReactMarkdown
    className={clsx(className, {
      markdown: !isPure,
    })}
    style={{ whileSpace: 'pre-wrap' }}
    {...props}
    remarkPlugins={[remarkGfm]}
  >
    {children}
  </ReactMarkdown>
);

export default RandomName;
