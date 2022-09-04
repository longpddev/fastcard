import React from "react";
import CardBase from "./CardBase";

const CardExplain = (props) => {
  const title = (
    <h2 className="text-center text-2xl py-2 border-t-2 border-t-green-500 border-b border-slate-700">
      Card explain
    </h2>
  );
  return <CardBase title={title} {...props} />;
};

export default CardExplain;
