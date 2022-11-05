import React from "react";
import clsx from "clsx";
import { useEffect } from "react";
import { useRef } from "react";
const Segment = ({ segment }) => {
  const ref = useRef();
  useEffect(() => {
    if (!segment.isActive() || !ref.current) return;
    ref.current.scrollIntoViewIfNeeded && ref.current.scrollIntoViewIfNeeded();
  }, [segment.isActive()]);
  return (
    <div
      ref={ref}
      className={clsx("px-2 py-1 mb-2 rounded-sm", {
        "bg-slate-800 text-sky-300": segment.isActive(),
        "hover:bg-slate-700 cursor-pointer hover:opacity-80 opacity-50":
          !segment.isActive(),
      })}
      onClick={() => !segment.isActive() && segment.activeMe()}
    >
      <span
        className="text-orange-400 group:text-slate-700 hover:underline cursor-pointer"
        onClick={() => segment.activeMe()}
      >
        {segment.timeFormat}
      </span>
      &nbsp;&nbsp;
      <span className="group:text-slate-800">{segment.text}</span>
    </div>
  );
};

export default Segment;
