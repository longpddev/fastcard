'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { KEY_NAME } from '@/constants/index';
import { clsx } from 'clsx';
import OutsideTheApp from '@/ui/OutsideTheApp';
import ButtonShortCut from '@/ui/ButtonShortCut';
import { IReactProps } from '@/interfaces/common';

let stackPopup: Array<{}> = [];

const PopupLazy: IReactProps<{
  open: boolean;
  setOpen: (s: boolean) => void;
  maxWidth?: number;
  backgroundColor?: string;
}> = ({
  open,
  setOpen,
  children,
  maxWidth = 600,
  backgroundColor = 'bg-slate-800',
}) => {
  const refId = useRef({});
  useEffect(() => {
    if (!open) return;
    const key = (refId.current = {});

    stackPopup.push(key);

    return () => {
      stackPopup = stackPopup.filter((item) => item !== key);
    };
  }, [open]);

  return (
    <OutsideTheApp>
      <AnimatePresence>
        {open && (
          <motion.div
            className={'fixed inset-0 z-40 h-full w-full'}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 h-full w-full bg-black opacity-40"
              onClick={() => setOpen(false)}
            ></div>
            <div className="absolute top-[50%] left-0 flex w-full translate-y-[-50%] justify-center p-4">
              <div
                style={{
                  maxWidth: `${maxWidth}px`,
                }}
                className={clsx(
                  'relative w-full overflow-hidden rounded-sm',
                  backgroundColor,
                )}
              >
                <div className="absolute top-0 right-0 z-10 inline-flex bg-slate-700 hover:text-orange-300 active:bg-slate-600">
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
                    <i className="fas fa-xmark px-[0.288em] text-3xl"></i>
                  </ButtonShortCut>
                </div>
                <div className={'max-h-[95vh] overflow-hidden overflow-y-auto'}>
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