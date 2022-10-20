import React from "react";
import { useRef } from "react";
import { useEffect } from "react";

const ProgressUpload = ({ processing, speed, loaded, total, ...props }) => {
  const ref = useRef();
  useEffect(() => {}, []);
  return (
    <div {...props}>
      <div className="relative w-full h-2 rounded-full overflow-hidden bg-slate-600">
        <div
          className="absolute left-0 top-0 bottom-0 rounded-full bg-sky-400 w-0 h-full transition-all animate-progress overflow-hidden before:opacity-50"
          style={{
            width: `${processing}%`,
          }}
          ref={ref}
        ></div>
      </div>
      <div className="flex flex-wrap mt-2 relative">
        <p className="absolute top-0 left-0">{loaded}</p>
        <p className="text-center mx-auto">
          <span className="text-slate-400">{speed}</span>/s{" "}
          <span className="text-xl text-green-400">{processing}</span>%
        </p>
        <p className="absolute top-0 right-0">{total}</p>
      </div>
    </div>
  );
};

export default ProgressUpload;
