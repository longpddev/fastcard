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
      className={clsx("px-2 py-px mb-4 rounded-sm", {
        "bg-slate-700": segment.isActive(),
        "hover:bg-slate-800 cursor-pointer": !segment.isActive(),
      })}
      onClick={() => segment.activeMe()}
    >
      <span className="text-orange-400 group:text-slate-700">
        {segment.timeFormat}
      </span>
      &nbsp;&nbsp;
      <span className="group:text-slate-800">{segment.text}</span>
    </div>
  );
};

export default Segment;
