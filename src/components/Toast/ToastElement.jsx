import clsx from "clsx";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef } from "react";
import { animate } from "../../functions/common";
import Markdown from "../Markdown";
import { COUNT_DOWN, TYPE } from "./core";

const ToastElement = ({ toast, removeToast }) => {
  const remove = useCallback(() => removeToast(toast), []);
  const progressRef = useRef();
  const count_down = useRef(COUNT_DOWN);
  if (toast.count_down) count_down.current = toast.count_down;

  useEffect(() => {
    const timer = setTimeout(remove, count_down.current);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const element = progressRef.current;
    if (!element) return;
    const getTime = () => new Date().getTime();
    const startTime = getTime();
    return animate(() => {
      const currentTime = getTime();
      const remain = count_down.current + startTime - currentTime;
      const remainPercent = (remain / count_down.current) * 100;

      if (remain <= 0) {
        element.style.width = `0%`;
      } else {
        element.style.width = `${remainPercent}%`;
      }
      return true;
    });
  }, []);
  return (
    <motion.div
      layout
      className="rounded-sm bg-slate-800 shadow-lg shadow-slate-900 flex px-4 py-2 pl-3 w-fulltext-slate-50 overflow-hidden relative"
      animate={{
        opacity: 1,
        left: "0%",
      }}
      initial={{
        opacity: 0,
        left: "100%",
      }}
      exit={{
        opacity: 0,
        left: "100%",
      }}
    >
      <i
        className={clsx(
          "mr-2",
          {
            "fa-solid fa-circle-info": TYPE.info === toast.type,
            "fa-solid fa-circle-check": TYPE.success === toast.type,
            "fa-solid fa-triangle-exclamation": TYPE.warning === toast.type,
            "fa-solid fa-circle-exclamation": TYPE.error === toast.type,
            "fa-solid fa-circle-notch animate-spin":
              TYPE.loading === toast.type,
          },
          {
            "text-sky-400": TYPE.info === toast.type,
            "text-green-400": TYPE.success === toast.type,
            "text-orange-400": TYPE.warning === toast.type,
            "text-red-400": TYPE.error === toast.type,
            "text-slate-400": TYPE.loading === toast.type,
          }
        )}
        title={toast.type}
      ></i>
      <div className="text-sm">
        <Markdown>{toast.message}</Markdown>
      </div>

      {TYPE.loading !== toast.type && (
        <div
          ref={progressRef}
          className={clsx("absolute bottom-0 left-0 bg-white h-0.5", {
            "bg-sky-400": TYPE.info === toast.type,
            "bg-green-400": TYPE.success === toast.type,
            "bg-orange-400": TYPE.warning === toast.type,
            "bg-red-400": TYPE.error === toast.type,
          })}
          style={{ width: "100%" }}
        />
      )}

      <button
        onClick={remove}
        className={clsx(
          "absolute top-0 right-0 flex  opacity-50 hover:opacity-100 text-sm p-1",
          {
            hidden: TYPE.loading === toast.type,
          }
        )}
      >
        <i className="fas fa-xmark px-[0.188em]"></i>
      </button>
    </motion.div>
  );
};

export default ToastElement;
