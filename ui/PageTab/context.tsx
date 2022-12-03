'use client';

import { memo, useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { createContext, useContext as useContextReact } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export const context = createContext();

const useActiveTab = (defaultActive, typeStep) => {
  const forwardRef = useRef();
  const [params, setParams] = useSearchParams();
  const [privateState, privateStateSet] = useState();
  let active;
  if (typeStep) {
    active = privateState;
  } else {
    active = params.get('page-tab') || defaultActive;
  }
  forwardRef.current = {
    params,
    setParams,
  };

  const setTabActive = useCallback((tab) => {
    if (typeStep) {
      privateStateSet(tab);
    } else {
      const newParams = new URLSearchParams(forwardRef.current.params);
      newParams.set('page-tab', tab);
      setParams(newParams);
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

export const Provider = memo(
  ({
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

    const tabList = useRef([]);
    const handle = useRef();

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
        if (beforeNext && !beforeNext(tabList.current[this.current()])) return;
        const tabTo = tabList.current[this.current() + 1];
        if (onNext && onNext(tabList.current[this.current()], tabTo) === false)
          return;
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
  },
);

export function useContext() {
  return useContextReact(context);
}
