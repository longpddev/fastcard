'use client';

import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { IReactProps } from '@/interfaces/common';

const ReadMoreText: IReactProps<{
  maxLine?: number;
  classNameText?: string;
}> = ({ children, className = '', maxLine = 3, classNameText = '' }) => {
  const [less, lessSet] = useState(true);
  const [show, showSet] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      const isScrollable = el.scrollHeight > el.clientHeight;
      observer.disconnect();
      if (!isScrollable) {
        showSet(false);
      } else {
        showSet(true);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div className={className}>
      <span
        ref={ref}
        className={clsx('inline-block', classNameText, {
          'overflow-hidden text-ellipsis': show && less,
        })}
        style={{ maxHeight: less ? `${maxLine * 1.55}em` : '' }}
      >
        {children}
      </span>
      {show ? (
        <span
          className="inline-block cursor-pointer select-none text-sm text-orange-400 underline"
          onClick={() => lessSet(!less)}
        >
          {less ? 'read more' : 'read less'}
        </span>
      ) : null}
    </div>
  );
};

export default ReadMoreText;
