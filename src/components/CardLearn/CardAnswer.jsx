import React from "react";
import CardBase from "./CardBase";

const CardAnswer = (props) => {
  const title = (
    <h2 className="text-center text-2xl py-2 border-t-2 border-t-blue-500 border-b border-slate-700">
      Answer
    </h2>
  );
  return <CardBase title={title} {...props} />;
};

export default CardAnswer;
