'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { watchThunk } from '../functions/common';
import { pushToast } from '@/ui/Toast/core';
import { AnyAction } from '@reduxjs/toolkit';

import { progressWatchPromise } from '@/ui/ProgressGlobal';

export function useThunk<T extends (params: any) => AnyAction, P>(
  thunk: T,
  params: P,
) {
  const dispatch = useDispatch();
  const fetchData = useRef() as { current: () => Promise<any> };
  const [result, resultSet] = useState<any>();
  fetchData.current = () =>
    dispatch(thunk(params))
      .then(watchThunk)
      .then(({ payload }: { payload: any }) => resultSet(payload))
      .catch(() => pushToast.error('Load data fail'))
      .finally(progressWatchPromise());
  useEffect(() => {
    fetchData.current();
  }, [params]);

  return {
    data: result,
    reload: useCallback(() => fetchData.current(), []),
  };
}
