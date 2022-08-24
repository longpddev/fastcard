import React from "react";

const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`rounded-md overflow-hidden bg-slate-800 block-up ${className}`}
      {...props}
    >
      <div className="shadow-top h-full rounded-md">{children}</div>
    </div>
  );
};

export default Card;
