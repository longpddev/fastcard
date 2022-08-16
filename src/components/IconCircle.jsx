import React from "react";

const IconCircle = ({ className = "", wrapClass = "", ...props }) => {
  return (
    <div
      className={`rounded-full relative w-10 h-10 bg-slate-700 hover:bg-slate-600 translate-all cursor-pointer ${wrapClass}`}
      {...props}
    >
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
        <i className={`${className}`}></i>
      </div>
    </div>
  );
};

export default IconCircle;
