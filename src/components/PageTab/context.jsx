import { useRef } from "react";
import { useState } from "react";
import { createContext, useContext as useContextReact } from "react";

export const context = createContext();

export function Provider({
  children,
  defaultActive,
  typeStep,
  onNext,
  onPrev,
}) {
  const [tabActive, setTabActive] = useState(defaultActive);
  const tabList = useRef([]);
  const handle = useRef();

  handle.current = {
    current() {
      return tabList.current.indexOf(tabActive);
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
      const tabTo = tabList.current[this.current() + 1];
      if (onNext && onNext(tabTo) === false) return;
      setTabActive(tabTo);
    },
    prev() {
      // prevent prev step
      const tabTo = tabList.current[this.current() - 1];
      if (onPrev && onPrev(tabTo) === false) return;
      setTabActive(tabTo);
    },
  };
  return (
    <context.Provider
      value={{
        tabActive,
        setTabActive,
        typeStep,
        tabList,
        handle,
      }}
    >
      {children}
    </context.Provider>
  );
}

export function useContext() {
  return useContextReact(context);
}
