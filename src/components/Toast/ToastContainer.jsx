import OutsideTheApp from "@components/OutsideTheApp";
import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { useSubscribeToast } from "./core";
import ToastElement from "./ToastElement";
function reverse(arr) {
  const result = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }
  return result;
}
const ToastContainer = () => {
  const { toast, removeToast } = useSubscribeToast();
  return (
    <OutsideTheApp>
      <div
        className={clsx(
          "fixed top-0 right-0  z-50 max-w-[350px] w-full grid gap-3 overflow-hidden",
          {
            "p-4": toast.length > 0,
          }
        )}
      >
        <AnimatePresence>
          {reverse(toast).map((item) => {
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
