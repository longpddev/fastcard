import React from "react";
import CardBase from "./CardBase";

const CardExplain = () => {
  const title = (
    <h2 className="text-center text-2xl py-2 border-t-2 border-t-green-500 border-b border-slate-700">
      Card explain
    </h2>
  );
  return (
    <CardBase title={title}>
      <h2 className="text-4xl text-center">Card explain</h2>
    </CardBase>
  );
};

export default CardExplain;
