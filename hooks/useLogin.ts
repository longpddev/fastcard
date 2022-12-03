'use client';

import { useSelector } from 'react-redux';
import { RootState } from 'store/app';

export const useLogin = () => {
  const token = useSelector<RootState>((state) => state.auth.token);
  const loading = useSelector<RootState>((state) => state.auth.loading);
  return {
    isLogin: Boolean(token),
    loading,
  };
};
