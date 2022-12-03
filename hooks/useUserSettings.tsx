'use client';

import { useSelector } from 'react-redux';
import { RootState } from 'store/app';

export default function useUserSettings() {
  return useSelector<RootState>((s) => s.auth.settings);
}
