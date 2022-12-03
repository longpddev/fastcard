'use client';

import React, { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useLogin } from '../../hooks/useLogin';
import { pushToast } from '../Toast';

const HasLogin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isLogin, loading } = useLogin();
  const router = useRouter();

  // useEffect(() => {
  //   if (isLogin) return;
  //   // pushToast.warning("Please login first");
  // }, [loading]);
  useEffect(() => {
    if (isLogin || loading) return;
    router.replace('/login');
  }, [isLogin, loading]);
  return isLogin ? children : null;
};

export default HasLogin;
