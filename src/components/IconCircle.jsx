import clsx from "clsx";
import React from "react";

const IconCircle = ({
  className = "",
  wrapClass = "",
  size = "lg",
  ...props
}) => {
  return (
    <div
      className={clsx(
        `rounded-full relative w-10 h-10 bg-slate-700 hover:bg-slate-600 translate-all cursor-pointer`,
        wrapClass,
        {
          "w-12 h-12": size === "xl",
          "w-10 h-10": size === "lg",
          "w-7 h-7": size === "md",
          "w-5 h-5": size === "sm",
        }
      )}
      {...props}
    >
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
        <i className={`${className}`}></i>
      </div>
    </div>
  );
};

export default IconCircle;
