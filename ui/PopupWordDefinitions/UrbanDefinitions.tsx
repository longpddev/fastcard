'use client';

import useUrbanDictionary from '@/hooks/useUrbanDictionary';
import React, { useEffect, useMemo, useRef } from 'react';
import ReadMoreText from '@/ui/ReadMoreText';
import UrbanDefinitionsItem from './UrbanDefinitionsItem';
import { IReactProps } from '@/interfaces/common';

/**
 *
 * @param { Date } date
 * @returns { string }
 */
const formatTime = (date: Date) => {
  return date.toDateString();
};

const UrbanDefinitions: IReactProps<{
  words: string;
  onDefineMore: (w: string) => void;
  limit?: number;
}> = ({ words, onDefineMore, limit = 7 }) => {
  const { data, isError } = useUrbanDictionary(words);
  const ref = useRef<HTMLDivElement>(null);
  const items = useMemo(
    () => data?.filter((_, i) => i + 1 <= limit) || [],
    [data],
  );
  useEffect(() => {
    const el = /** @type { HTMLDivElement | undefined } */ ref.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      const isScrollable = el.scrollWidth > el.clientWidth;

      if (!isScrollable) return;

      e.preventDefault();
      e.stopPropagation();

      const delta = (e.deltaX === 0 ? e.deltaY : e.deltaX) * 0.5;
      const currentScroll = el.scrollLeft;

      el.scrollTo({ left: currentScroll + delta });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);
  return (
    <div className="flex gap-2 overflow-auto py-4" tabIndex={0} ref={ref}>
      {items.map((item) => (
        <UrbanDefinitionsItem
          key={item.defid}
          onDefineMore={onDefineMore}
          urbanData={item}
        />
      ))}
    </div>
  );
};

export default UrbanDefinitions;
