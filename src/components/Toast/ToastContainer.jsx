import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { createPortal } from "react-dom";
import { useSubscribeToast } from "./core";
import ToastElement from "./ToastElement";
function reverse(arr) {
  const result = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }
  return result;
}
const OutsideTheApp = ({ children }) => createPortal(children, document.body);
const ToastContainer = () => {
  const { toast, removeToast } = useSubscribeToast();
  console.log(toast);
  // reverse(toast);
  return (
    <OutsideTheApp>
      <div
        className={clsx(
          "fixed top-0 right-0  z-50 max-w-[250px] w-full grid gap-3 overflow-hidden",
          {
            "p-4": toast.length > 0,
          }
        )}
      >
        <AnimatePresence>
          {reverse(toast).map((item) => {
            console.log(item.id);
            return (
              <ToastElement
                toast={item}
                removeToast={removeToast}
                key={item.id}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </OutsideTheApp>
  );
};

export default ToastContainer;
