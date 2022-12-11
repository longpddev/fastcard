'use client';

import { IReactProps } from '@/interfaces/common';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { createContext, useContext as useContextReact } from 'react';
import { IPageTabProps } from './index';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export interface HandleTab {
  current: () => number;
  isNext: () => boolean;
  isPrev: () => boolean;
  next: () => void;
  prev: () => void;
  reset: () => void;
}
export const context = createContext(
  {} as {
    tabActive: string;
    setTabActive: (v: string) => void;
    typeStep: boolean;
    tabList: {
      current: Array<string>;
    };
    handle: {
      current: HandleTab;
    };
    onSubmit: () => void;
  },
);

const useActiveTab = (defaultActive: string, typeStep: boolean) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const forwardRef = useRef<{
    searchParams: typeof searchParams;
    pathname: typeof pathname;
  }>();
  const [privateState, privateStateSet] = useState('');
  let active = searchParams.get('page-tab') || defaultActive;
  if (typeStep) {
    active = privateState;
  }
  forwardRef.current = {
    searchParams,
    pathname,
  };

  const setTabActive = useCallback((tab: string) => {
    if (typeStep) {
      privateStateSet(tab);
    } else {
      if (!forwardRef.current) return;
      const newParams = new URLSearchParams(forwardRef.current.searchParams);
      newParams.set('page-tab', tab);
      router.push(forwardRef.current.pathname + '?' + newParams.toString());
    }
  }, []);

  useEffect(() => {
    if (active || !defaultActive) return;
    setTabActive(defaultActive);
  }, [defaultActive]);
  return {
    active,
    setTabActive,
  };
};

export const Provider: IReactProps<IPageTabProps> = ({
  children,
  defaultActive,
  typeStep,
  onNext,
  onPrev,
  onSubmit,
  beforeNext,
  controlRef,
}) => {
  // const [active, activeSet] = useState();
  const { active, setTabActive } = useActiveTab(defaultActive, typeStep);

  const tabList = useRef([] as Array<string>);
  const handle = useRef({} as HandleTab);

  handle.current = {
    current() {
      return tabList.current.indexOf(active);
    },
    isNext() {
      const currentIndex = this.current();
      return currentIndex + 1 < tabList.current.length && currentIndex >= 0;
    },
    isPrev() {
      return this.current() > 0;
    },
    next() {
      // prevent next step
      const current = this.current();
      if (beforeNext && !beforeNext(tabList.current[current])) return;
      const tabTo = tabList.current[this.current() + 1];
      if (onNext && onNext(tabList.current[current], tabTo) === false) return;
      setTabActive(tabTo);
    },
    prev() {
      // prevent prev step
      const tabTo = tabList.current[this.current() - 1];
      if (onPrev && onPrev(tabTo) === false) return;
      setTabActive(tabTo);
    },
    reset() {
      setTabActive(tabList.current[0]);
    },
  };

  if (controlRef) controlRef.current = handle.current;
  return (
    <context.Provider
      value={{
        tabActive: active,
        setTabActive,
        typeStep,
        tabList,
        handle,
        onSubmit,
      }}
    >
      {children}
    </context.Provider>
  );
};

export function useContext() {
  return useContextReact(context);
}
