import useUrbanDictionary from "@hooks/useUrbanDictionary";
import React, { useEffect, useMemo, useRef } from "react";
import { firstCapitalize, parseStringToArr } from "@/functions/common";
import ReadMoreText from "@components/ReadMoreText";
import UrbanDefinitionsItem from "./UrbanDefinitionsItem";

/**
 *
 * @param { Date } date
 * @returns { string }
 */
const formatTime = (date) => {
  return date.toDateString();
};

const UrbanDefinitions = ({ words, onDefineMore, limit = 7 }) => {
  const { data, isError } = useUrbanDictionary(words);
  const ref = useRef();
  const items = useMemo(
    () => data?.filter((_, i) => i + 1 <= limit) || [],
    [data]
  );
  useEffect(() => {
    const el = /** @type { HTMLDivElement | undefined } */ (ref.current);
    if (!el) return;
    const handleWheel = (e) => {
      const isScrollable = el.scrollWidth > el.clientWidth;

      if (!isScrollable) return;

      e.preventDefault();
      e.stopPropagation();

      const delta = (e.deltaX === 0 ? e.deltaY : e.deltaX) * 0.5;
      const currentScroll = el.scrollLeft;

      el.scrollTo({ left: currentScroll + delta });
    };
    el.addEventListener("wheel", handleWheel, { passive: false });

    return () =>
      el.removeEventListener("wheel", handleWheel, { passive: false });
  }, []);
  return (
    <div className="overflow-auto flex gap-2 py-4" tabIndex={0} ref={ref}>
      {items.map((item) => (
        <UrbanDefinitionsItem
          key={item.defid}
          onDefineMore={onDefineMore}
          word={item.word}
          definition={item.definition}
          permalink={item.permalink}
          example={item.example}
          sound_urls={item.sound_urls}
          written={formatTime(new Date(item.written_on))}
        />
      ))}
    </div>
  );
};

export default UrbanDefinitions;
