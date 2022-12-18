'use client';

import { PromiseResult } from '@/interfaces/common';
import {
  getCardLearnTodayByGroupIdApi,
  getGroupCardApi,
  setCardLearnTodayByGroupIdAction,
  setGroupCard,
} from '@/services/card/cardSlice';
import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  getUserInfoApiResponse,
  setUserInfoAction,
} from '@/services/auth/authSlice';

const InitDataInPage: React.FC<{
  value: {
    userInfo: getUserInfoApiResponse;
    groupCard: PromiseResult<typeof getGroupCardApi>;
    cardLearnTodays: PromiseResult<typeof getCardLearnTodayByGroupIdApi>[];
  };
  children: React.ReactNode;
}> = ({ children, value: { userInfo, groupCard, cardLearnTodays } }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserInfoAction(userInfo));
    dispatch(setGroupCard(groupCard));
    cardLearnTodays.map((item) =>
      dispatch(setCardLearnTodayByGroupIdAction(item)),
    );
  }, []);

  return <>{children}</>;
};

export default InitDataInPage;
