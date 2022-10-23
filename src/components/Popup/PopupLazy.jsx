import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import useShortcut from "../../hooks/useShortcut";
import { KEY_NAME } from "@/constants/index";
const OutsideTheApp = ({ children }) => createPortal(children, document.body);

let stackPopup = [];

const PopupLazy = ({ open, setOpen, handleRef, children, maxWidth = 600 }) => {
  const refId = useRef();
  useEffect(() => {
    if (!open) return;
    const key = (refId.current = {});

    stackPopup.push(key);

    return () => (stackPopup = stackPopup.filter((item) => item !== key));
  }, [open]);

  useShortcut(KEY_NAME.Escape, (e) => {
    e.preventDefault();
    if (
      stackPopup.length > 0 &&
      stackPopup[stackPopup.length - 1] === refId.current
    ) {
      setOpen(false);
    }
  });
  return (
    <OutsideTheApp>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 h-full w-full z-40"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 w-full h-full bg-black opacity-40"
              onClick={() => setOpen(false)}
            ></div>
            <div className="p-4 w-full absolute top-[50%] left-0 flex justify-center translate-y-[-50%] ">
              <div
                style={{ maxWidth: `${maxWidth}px` }}
                className="w-full bg-slate-800 relative overflow-hidden rounded-sm"
              >
                <button
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="inline-flex z-10 absolute top-0 right-0 bg-slate-700 active:bg-slate-600 hover:text-orange-300"
                >
                  <i className="fas fa-xmark text-3xl px-[0.288em]"></i>
                </button>
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OutsideTheApp>
  );
};

export default PopupLazy;
