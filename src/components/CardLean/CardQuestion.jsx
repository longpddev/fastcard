import React from "react";
import CardBase from "./CardBase";

const CardQuestion = () => {
  const title = (
    <h2 className="text-center text-2xl py-2 border-t-2 border-t-orange-500 border-b border-slate-700">
      Card question
    </h2>
  );
  return (
    <CardBase
      title={title}
      image="https://media.istockphoto.com/vectors/english-vector-id1047570732"
    >
      <h2 className="text-4xl text-center">Card question</h2>
    </CardBase>
  );
};

export default CardQuestion;
