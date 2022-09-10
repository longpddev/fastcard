import React from "react";
import CardBase from "./CardBase";

const CardQuestion = ({ children, ...props }) => {
  const title = (
    <h2 className="text-center text-2xl py-2 border-t-2 border-t-orange-500 border-b border-slate-700">
      Question
    </h2>
  );
  return <CardBase title={title} children={children} {...props} />;
};

export default CardQuestion;
