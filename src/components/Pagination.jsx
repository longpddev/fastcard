import clsx from "clsx";
import React from "react";

const Pagination = ({ onChange, max, current }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array(max)
        .fill(1)
        .map((_, index) => (
          <button
            className={clsx("px-2 py-1 rounded-md bg-slate-700", {
              "text-green-400": current === index + 1,
            })}
            onClick={() => onChange(index + 1)}
            key={index}
          >
            {index + 1}
          </button>
        ))}
    </div>
  );
};

export default Pagination;
