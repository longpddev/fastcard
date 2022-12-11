'use client';

import React from 'react';
import { useState } from 'react';
import CardExplain from './CardExplain';
import CardQuestion from './CardQuestion';

import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { path } from 'ramda';
import { getMedia } from '@/api/client';
import { nextProcess, updateCardLearnedThunk } from '@/services/card/cardSlice';
import { watchThunk } from '@/functions/common';
import { pushFastToast } from '../Toast/core';
import { CARD_LEAN_TYPE, CARD_TYPE } from '@/constants/index';
import CardAnswer from './CardAnswer';
import useUserSettings from '@/hooks/useUserSettings';
import { ButtonControl } from './ButtonControl';
import { IReactProps } from '@/interfaces/common';
import { AppDispatch, RootState } from 'store/app';

const animateOption = {
  slide: {
    exit: { opacity: 0, left: '40%' },
    initial: { opacity: 0, left: '70%' },
    animate: { opacity: 1, left: '50%' },
  },
  fade: {
    exit: { opacity: 0 },
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  none: {},
};

const CardLearn: IReactProps<{
  groupId: number;
}> = ({ groupId }) => {
  const [isFront, isFrontSet] = useState(true);
  const process = useSelector((s: RootState) => s.card.process[groupId]);
  const settings = useUserSettings();
  const dispatch = useDispatch<AppDispatch>();
  const cardLearnEntities = useSelector(
    (s: RootState) => s.card.learnToday.entities,
  );
  const card = cardLearnEntities[groupId]?.card.rows[process];

  const handleAction = (type: string) => {
    const update = (isHard: boolean) => () =>
      dispatch(updateCardLearnedThunk({ cardId: card.id, isHard, groupId }))
        .then(watchThunk)
        .then(() => {
          isFrontSet(true);
        })
        .catch((e) => {
          pushFastToast.error('Sometime error, please try again');
        });
    const caseOb = {
      [CARD_LEAN_TYPE.repeat]: () => {
        dispatch(nextProcess({ groupId }));
        isFrontSet(true);
      },
      [CARD_LEAN_TYPE.good]: update(false),
      [CARD_LEAN_TYPE.hard]: update(true),
    };

    return caseOb[type as keyof typeof caseOb]();
  };

  if (card.backCard.image) {
    const image = new Image();
    image.src = getMedia(card.backCard.image.path);
  }

  const animateSetting = settings.cardAnimate
    ? animateOption[settings.cardAnimate]
    : animateOption.fade;
  return (
    <div className="card-learn relative h-full">
      <div className="card-learn__main mb-4">
        <AnimatePresence>
          {isFront && (
            <motion.div
              key="front"
              className="absolute top-0 left-[50%] w-[min-content] translate-x-[-50%]"
              {...animateSetting}
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
              className="absolute top-0 left-[50%] w-[min-content] translate-x-[-50%]"
              {...animateSetting}
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
      <ButtonControl
        isFront={isFront}
        isFrontSet={isFrontSet}
        handleAction={handleAction}
      />
    </div>
  );
};

const CardCreator: IReactProps<{
  type: string;
  image: string;
  width: number;
  height: number;
}> = ({ type, ...props }) => {
  if (!(type in CARD_TYPE)) throw new Error('type do not exist');

  switch (type) {
    case CARD_TYPE.question:
      return <CardQuestion {...props} />;
    case CARD_TYPE.answer:
      return <CardAnswer {...props} />;
    case CARD_TYPE.explain:
      return <CardExplain {...props} />;
  }

  return null;
};
export default CardLearn;