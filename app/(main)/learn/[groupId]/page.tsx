'use client';

import { IReactProps } from '@/interfaces/common';
import { initProcess } from '@/services/card/cardSlice';
import Breadcrumb from '@/ui/Breadcrumb';
import CardLearn from '@/ui/CardLearn';
import LoadingIcon from '@/ui/LoadingIcon';
import { path } from 'ramda';
import React, { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/app';

const Wrapper: IReactProps = ({ children }) => (
  <>
    <Breadcrumb></Breadcrumb>
    {children}
  </>
);

const page = ({ params }: { params: { groupId: string } }) => {
  const groupId = parseInt(params.groupId);
  const isExistInLearn = useSelector((s: RootState) =>
    Boolean(s.card.learnToday.entities[groupId]),
  );
  const isInitProcess = useSelector((s: RootState) =>
    Boolean(s.card.process[groupId] !== undefined),
  );
  const isExistCardForLearn = useSelector((s: RootState) =>
    Boolean(path(['card', 'rows', 0])(s.card.learnToday.entities[groupId])),
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (isInitProcess) return;

    dispatch(initProcess({ groupId }));
  }, []);

  if (!isExistInLearn || !isInitProcess)
    return (
      <Wrapper>
        <div className="">
          <LoadingIcon></LoadingIcon>
        </div>
      </Wrapper>
    );

  if (!isExistCardForLearn)
    return (
      <Wrapper>
        <h2 className="text-center text-4xl ">
          You do not have a card to learn today
        </h2>
        <div className="firework-delay"></div>
        <div className="firework"></div>
      </Wrapper>
    );
  return (
    <Wrapper>
      <CardLearn groupId={groupId}></CardLearn>
    </Wrapper>
  );
};

export default page;
