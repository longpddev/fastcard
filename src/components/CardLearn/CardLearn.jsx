import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import CardExplain from "./CardExplain";
import CardQuestion from "./CardQuestion";

import { motion, AnimatePresence } from "framer-motion";
import ShortCutClick, { GlobalKeys } from "../ShortCutClick";
import { useDispatch, useSelector } from "react-redux";
import { path } from "ramda";
import { getMedia } from "../../api/client";
import {
  nextProcess,
  updateCardLearnedThunk,
} from "../../services/card/cardSlice";
import { watchThunk } from "../../functions/common";
import { pushFastToast } from "../Toast/core";
import { CARD_TYPE } from "../../constants";
import CardAnswer from "./CardAnswer";

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
const CARD_LEAN_TYPE = {
  hard: "hard",
  good: "good",
  repeat: "repeat",
};
const CardLearn = ({ groupId }) => {
  const [isFront, isFrontSet] = useState(true);
  const process = useSelector((s) => s.card.process)[groupId];
  const dispatch = useDispatch();
  const card = path([groupId, "card", "rows", process])(
    useSelector((s) => s.card.learnToday.entities)
  );

  const handleAction = (type) => {
    const update = (isHard) => () =>
      dispatch(updateCardLearnedThunk({ cardId: card.id, isHard, groupId }))
        .then(watchThunk)
        .then(() => {
          isFrontSet(true);
        })
        .catch((e) => {
          pushFastToast.error("Sometime error, please try again");
        });
    const caseOb = {
      [CARD_LEAN_TYPE.repeat]: () => {
        dispatch(nextProcess({ groupId }));
        isFrontSet(true);
      },
      [CARD_LEAN_TYPE.good]: update(false),
      [CARD_LEAN_TYPE.hard]: update(true),
    };

    return caseOb[type]();
  };

  if (card.backCard.image) {
    const image = new Image();
    image.src = getMedia(card.backCard.image.path);
  }
  console.log(card.frontCard.type);
  return (
    <div className="relative card-learn h-full">
      <div className="card-learn__main mb-4">
        <AnimatePresence>
          {isFront && (
            <motion.div
              key="front"
              className="absolute top-0 left-[50%] translate-x-[-50%] w-[min-content]"
              {...animateOption.slide}
            >
              <CardCreator
                type={card.frontCard.type}
                image={getMedia(card.frontCard.image?.path)}
                width={card.frontCard.image?.width}
                height={card.frontCard.image?.height}
                children={card.frontCard.content}
              />
            </motion.div>
          )}
          {!isFront && (
            <motion.div
              key="back"
              className="absolute top-0 left-[50%] translate-x-[-50%] w-[min-content]"
              {...animateOption.slide}
            >
              <CardCreator
                type={card.backCard.type}
                image={getMedia(card.backCard.image?.path)}
                width={card.backCard.image?.width}
                height={card.backCard.image?.height}
                children={card.backCard.content}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="pt-10 flex gap-6 justify-center items-center shadow-top mt-10">
        {isFront ? (
          <GlobalKeys
            handlers={{
              Enter: () => isFrontSet(false),
            }}
          >
            <button
              className="button text-sky-300"
              onClick={() => isFrontSet(false)}
            >
              View results
            </button>
          </GlobalKeys>
        ) : (
          <GlobalKeys
            handlers={{
              "SPACE_BAR+r": () => handleAction(CARD_LEAN_TYPE.repeat),
              "SPACE_BAR+g": () => handleAction(CARD_LEAN_TYPE.good),
              Enter: () => handleAction(CARD_LEAN_TYPE.good),
              "SPACE_BAR+h": () => handleAction(CARD_LEAN_TYPE.hard),
            }}
          >
            <button
              title="SPACE_BAR+r"
              onClick={() => {
                handleAction(CARD_LEAN_TYPE.repeat);
              }}
              className="text-stone-400 text-xl button"
            >
              Repeat
            </button>
            <button
              title="SPACE_BAR+g"
              onClick={() => {
                handleAction(CARD_LEAN_TYPE.good);
              }}
              className="text-green-400 text-xl button"
            >
              Good
            </button>
            <button
              title="SPACE_BAR+h"
              onClick={() => {
                handleAction(CARD_LEAN_TYPE.hard);
              }}
              className="text-red-400 text-xl button"
            >
              Hard
            </button>
          </GlobalKeys>
        )}
      </div>
    </div>
  );
};

const CardCreator = ({ type, ...props }) => {
  if (!(type in CARD_TYPE)) throw new Error("type do not exist");

  switch (type) {
    case CARD_TYPE.question:
      return <CardQuestion {...props} />;
    case CARD_TYPE.answer:
      return <CardAnswer {...props} />;
    case CARD_TYPE.explain:
      return <CardExplain {...props} />;
  }
};
export default CardLearn;
