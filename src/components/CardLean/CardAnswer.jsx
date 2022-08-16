import React from "react";
import CardBase from "./CardBase";

const CardAnswer = () => {
  const title = (
    <h2 className="text-center text-2xl py-2 border-t-2 border-t-blue-500 border-b border-slate-700">
      Card question
    </h2>
  );
  return <CardBase title={title} />;
};

export default CardAnswer;
