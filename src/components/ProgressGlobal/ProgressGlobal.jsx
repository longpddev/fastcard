import React, { useEffect, useRef, useState } from "react";
import { animate } from "../../functions/common";
import Emitter, { EmitterIdle } from "../../helpers/emitter";

export const progressEmitter = EmitterIdle();
export const progressDone = () => progressEmitter.emit("end");
export const progressStart = () => progressEmitter.emit("start");

const ProgressGlobal = () => {
  const [isDone, isDoneSet] = useState(false);
  const [isShow, isShowSet] = useState(false);
  const ref = useRef();
  const process = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const render = () =>
      (el.style.transform = `translateX(${process.current - 100}%)`);

    if (!isShow) {
      process.current = 0;
      render();
      return;
    }
    const stopAnimate = animate(() => {
      let factor = 0.1;

      if (process.current >= 100) {
        process.current = 100;
        render();
        isShowSet(false);
        return false;
      }

      if (isDone) {
        factor = 3;
      } else if (process.current > 90) {
        return;
      }
      process.current += factor;
      render();
      return true;
    });

    return () => {
      stopAnimate();
    };
  }, [isDone, isShow]);

  useEffect(() => {
    const handleStart = () => {
      isDoneSet(false);
      isShowSet(true);
    };
    const handleEnd = () => {
      isDoneSet(true);
    };
    progressEmitter.on("end", handleEnd);
    progressEmitter.on("start", handleStart);

    return () => {
      progressEmitter.off("end", handleEnd);
      progressEmitter.off("start", handleStart);
    };
  });
  return (
    <div className="fixed top-0 left-0 w-full h-[2px] bg-transparent overflow-hidden z-50">
      <div
        className="absolute overflow-hidden top-0 left-0 w-full h-full animate-progress bg-sky-400 z-10 translate-x-100"
        ref={ref}
      ></div>
    </div>
  );
};

export default ProgressGlobal;
