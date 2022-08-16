import React, { Children } from "react";
import Content from "./Content";
import { Provider } from "./context";
import Title from "./Title";

/**
 *
 * @param {function} onNext event next step end return false to stop step
 * @param {function} onPrev event prev step end return false to stop step
 * @returns
 */
const PageTab = ({ children, defaultActive, typeStep, onNext, onPrev }) => {
  const TitleChildren = [];
  const ContentChildren = [];

  Children.forEach(children, (item) => {
    if (item.type.displayName === "Title") TitleChildren.push(item);
    if (item.type.displayName === "Content") ContentChildren.push(item);
  });
  return (
    <Provider
      defaultActive={defaultActive}
      onNext={onNext}
      onPrev={onPrev}
      typeStep={typeStep}
    >
      <div className="md:flex-row flex-col flex gap-4 main__inner">
        <div className="flex-none flex-wrap md:flex-nowrap overflow-hidden flex md:block md:min-w-[250px] md:self-start md:py-2 sticky top-page bg-slate-800 rounded-md">
          {TitleChildren}
        </div>
        <div className="flex-1 bg-slate-800 rounded-md md:self-start p-4">
          {ContentChildren}
        </div>
      </div>
    </Provider>
  );
};

PageTab.Title = Title;
PageTab.Title.displayName = "Title";
PageTab.Content = Content;
PageTab.Content.displayName = "Content";

export default PageTab;
