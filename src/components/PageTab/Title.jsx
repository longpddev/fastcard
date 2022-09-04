import React from "react";
import { useContext } from "./context";

const Title = ({ tabKey, children }) => {
  const { tabActive, setTabActive, typeStep, tabList } = useContext();
  const tabKeyString = tabKey.toString();
  // public tabkey
  if (!tabList.current.includes(tabKeyString))
    tabList.current.push(tabKeyString);

  return (
    <div
      tabIndex={1}
      className={`px-4 py-1 md:border-l-[3px] before:absolute before:inset-0 before:w-full before:h-full md:border-b-0 border-b-[3px] border-transparent relative  text-lg cursor-pointer ${
        tabKeyString === tabActive
          ? "border-blue-400  md:before:bg-blue-600 before:bg-blue-600 before:opacity-20"
          : "hover:border-blue-600 hover:border-opacity-10  hover:before:bg-blue-600 hover:before:opacity-10"
      } ${typeStep ? "cursor-not-allowed" : ""}`}
      onClick={() => !typeStep && setTabActive(tabKeyString)}
    >
      {children}
    </div>
  );
};

export default Title;
