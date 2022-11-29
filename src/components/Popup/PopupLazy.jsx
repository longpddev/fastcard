import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { KEY_NAME } from "@/constants/index";
import { clsx } from "clsx";
import OutsideTheApp from "@components/OutsideTheApp";
import ButtonShortCut from "@components/ButtonShortCut";

let stackPopup = [];

const PopupLazy = ({
  open,
  setOpen,
  children,
  maxWidth = 600,
  backgroundColor = "bg-slate-800",
}) => {
  const refId = useRef();
  useEffect(() => {
    if (!open) return;
    const key = (refId.current = {});

    stackPopup.push(key);

    return () => (stackPopup = stackPopup.filter((item) => item !== key));
  }, [open]);

  return (
    <OutsideTheApp>
      <AnimatePresence>
        {open && (
          <motion.div
            className={"inset-0 h-full w-full z-40 fixed"}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 w-full h-full bg-black opacity-40"
              onClick={() => setOpen(false)}
            ></div>
            <div className="w-full p-4 absolute top-[50%] left-0 flex justify-center translate-y-[-50%]">
              <div
                style={{
                  maxWidth: `${maxWidth}px`,
                }}
                className={clsx(
                  "w-full relative overflow-hidden rounded-sm",
                  backgroundColor
                )}
              >
                <div className="inline-flex z-10 absolute top-0 right-0 bg-slate-700 active:bg-slate-600 hover:text-orange-300">
                  <ButtonShortCut
                    shortcut={KEY_NAME.Escape}
                    onClickClassName="text-orange-300"
                    onClick={() => {
                      if (
                        stackPopup.length > 0 &&
                        stackPopup[stackPopup.length - 1] === refId.current
                      ) {
                        setOpen(false);
                      }
                    }}
                    className=""
                  >
                    <i className="fas fa-xmark text-3xl py-[0.1em] px-[0.288em]"></i>
                  </ButtonShortCut>
                </div>
                <div className={"max-h-[95vh] overflow-hidden overflow-y-auto"}>
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OutsideTheApp>
  );
};

export default PopupLazy;
