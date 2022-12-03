'use client';

import clsx from 'clsx';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const RandomName = ({ children, className = '', isPure = false, ...props }) => (
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
