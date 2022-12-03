'use client';

import React from 'react';
import { useLogin } from '../../hooks/useLogin';

const SearchSiteMain = () => {
  const { isLogin } = useLogin();

  if (!isLogin) return null;
  return null;
};

export default SearchSiteMain;
