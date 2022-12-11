'use client';

import { useLogin } from '@/hooks/useLogin';
import { IReactProps } from '@/interfaces/common';
import React from 'react';
import PopupShortCutDetailMain from './PopupShortCutDetailMain';

const PopupShortCutDetail: IReactProps = () => {
  const { isLogin } = useLogin();

  if (!isLogin) return null;
  return <PopupShortCutDetailMain />;
};

export default PopupShortCutDetail;
