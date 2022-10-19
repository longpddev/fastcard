import clsx from "clsx";
import React, { useLayoutEffect } from "react";
import { useId } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import IconCircle from "../IconCircle";

const MoreFeature = ({ children, className }) => {
  const [open, openSet] = useState(false);
  const idRef = useRef();
  if (!idRef.current)
    idRef.current = "element" + Math.random().toString(32).slice(2, 7);
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClick = (e) => {
      if (!e.target.closest(`.${idRef.current}`)) {
        openSet(false);
      }
    };
    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);
  return (
    <div ref={ref} className={clsx(className, idRef.current)}>
      <IconCircle
        size="md"
        onClick={() => openSet(!open)}
        className={clsx("fa-solid fa-ellipsis-vertical transition-all", {
          "rotate-90": open,
        })}
      ></IconCircle>

      {open && <MoreFeatureContent>{children}</MoreFeatureContent>}
    </div>
  );
};

const MoreFeatureContent = ({ children }) => {
  const ref = useRef();
  const [leftOrRight, leftOrRightSet] = useState("left");
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isOverlap = el.getBoundingClientRect().right > window.innerWidth;
    if (isOverlap) leftOrRightSet("right");
  }, []);
  return (
    <div
      ref={ref}
      className={clsx(
        "absolute top-[100%] z-10 overflow-hidden rounded-md py-2 bg-slate-600",
        {
          "right-0": leftOrRight === "right",
          "left-0": leftOrRight === "left",
        }
      )}
    >
      {children}
    </div>
  );
};

export default MoreFeature;
