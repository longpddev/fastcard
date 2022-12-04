'use client';

import { useSelector } from 'react-redux';
import { RootState } from 'store/app';

export default function useUserSettings() {
  return useSelector((s: RootState) => s.auth.settings);
}
