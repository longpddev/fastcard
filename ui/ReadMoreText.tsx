'use client';

import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { clsx } from 'clsx';

const ReadMoreText = ({
  component,
  children,
  className = '',
  maxLine = 3,
  classNameText = '',
}) => {
  const Component = component || 'p';
  const [less, lessSet] = useState(true);
  const [show, showSet] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      const isScrollable = el.scrollHeight > el.clientHeight;
      observer.disconnect(el);
      if (!isScrollable) {
        showSet(false);
      } else {
        showSet(true);
      }
    });

    observer.observe(el);
    return () => observer.disconnect(el);
  }, []);
  return (
    <Component className={className}>
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
    </Component>
  );
};

export default ReadMoreText;
