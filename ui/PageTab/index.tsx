'use client';

import React, { Children, useCallback, useRef } from 'react';
import Content from './Content';
import { Provider } from './context';
import Title from './Title';

/**
 *
 * @param {function} onNext event next step end return false to stop step
 * @param {function} onPrev event prev step end return false to stop step
 * @returns
 */
const PageTab = ({
  children,
  defaultActive,
  typeStep,
  onNext,
  beforeNext,
  onPrev,
  onSubmit,
  controlRef,
}) => {
  const handleRef = useRef({});
  const TitleChildren = [];
  const ContentChildren = [];

  // hard try to prevent change referent of function handle
  handleRef.current = {
    onNext,
    onPrev,
    onSubmit,
    beforeNext,
  };

  Children.forEach(children, (item) => {
    if (!item) return;
    if (item.type.displayName === 'Title') TitleChildren.push(item);
    if (item.type.displayName === 'Content') ContentChildren.push(item);
  });
  return (
    <Provider
      defaultActive={defaultActive?.toString()}
      controlRef={controlRef}
      onNext={onNext}
      onPrev={onPrev}
      typeStep={typeStep}
      onSubmit={onSubmit}
      beforeNext={beforeNext}
    >
      <div className="main__inner flex flex-col gap-4 md:flex-row">
        <div className="block-up top-page flex flex-none flex-wrap overflow-hidden rounded-md bg-slate-800 md:sticky md:block md:min-w-[250px] md:flex-nowrap md:self-start md:py-2">
          {TitleChildren}
        </div>
        <div className="block-up flex-1 rounded-md bg-slate-800 p-4 md:self-start">
          {ContentChildren}
        </div>
      </div>
    </Provider>
  );
};

PageTab.Title = Title;
PageTab.Title.displayName = 'Title';
PageTab.Content = Content;
PageTab.Content.displayName = 'Content';

export default PageTab;
