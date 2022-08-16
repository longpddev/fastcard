import React from "react";
import { useContext } from "./context";

const Title = ({ tabKey, children }) => {
  const { tabActive, setTabActive, typeStep, tabList } = useContext();

  // public tabkey
  if (!tabList.current.includes(tabKey)) tabList.current.push(tabKey);

  return (
    <div
      tabIndex={1}
      className={`px-4 py-1 md:border-l-[3px] md:border-b-0 border-b-[3px] border-transparent relative  text-lg cursor-pointer ${
        tabKey === tabActive
          ? "border-blue-400 before:absolute before:inset-0 before:w-full before:h-full md:before:bg-gradient-to-r before:bg-gradient-to-t before:from-blue-400 before:opacity-30 before:to-transparent"
          : ""
      }`}
      onClick={() => !typeStep && setTabActive(tabKey)}
    >
      {children}
    </div>
  );
};

export default Title;
