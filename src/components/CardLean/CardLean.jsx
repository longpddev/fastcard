import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import CardExplain from "./CardExplain";
import CardQuestion from "./CardQuestion";

import { motion, AnimatePresence } from "framer-motion";
import ShortCutClick from "../ShortCutClick";

const animateOption = {
  slide: {
    exit: { opacity: 0, left: "40%" },
    initial: { opacity: 0, left: "70%" },
    animate: { opacity: 1, left: "50%" },
  },
  fade: {
    exit: { opacity: 0 },
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
};

const CardLean = () => {
  const [state, setState] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setState((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(timer);
  }, []);
  return (
    <div className="relative card-learn h-full">
      <div className="card-learn__main mb-4">
        <AnimatePresence>
          {state % 2 === 0 && (
            <motion.div
              key="CardExplain"
              className="absolute top-0 left-[50%] translate-x-[-50%] w-[min-content]"
              {...animateOption.slide}
            >
              <CardExplain />
            </motion.div>
          )}
          {state % 2 !== 0 && (
            <motion.div
              key="CardQuestion"
              className="absolute top-0 left-[50%] translate-x-[-50%] w-[min-content]"
              {...animateOption.slide}
            >
              <CardQuestion />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="pt-10 flex gap-6 justify-center items-center shadow-top mt-10">
        <ShortCutClick
          keys={["shift+r"]}
          Component="button"
          onClick={() => {
            console.log("active");
          }}
          className="text-stone-400 text-xl button"
        >
          Repeat
        </ShortCutClick>
        <ShortCutClick
          keys={["shift+g"]}
          Component="button"
          onClick={() => {
            console.log("active");
          }}
          className="text-green-400 text-xl button"
        >
          Good
        </ShortCutClick>
        <ShortCutClick
          keys={["shift+h"]}
          Component="button"
          onClick={() => {
            console.log("active");
          }}
          className="text-red-400 text-xl button"
        >
          Hard
        </ShortCutClick>
      </div>
    </div>
  );
};

export default CardLean;
