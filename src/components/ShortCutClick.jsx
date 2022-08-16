import React from "react";
import { useMemo } from "react";
import { GlobalHotKeys } from "react-hotkeys";

const ShortCutClick = ({ children, keys, onClick, Component, ...props }) => {
  const keyMap = {
    SNAP_LEFT: keys,
  };

  const handlers = {
    SNAP_LEFT: () => {
      console.log("fkjshdkj");
      onClick();
    },
  };
  return (
    <>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
        <Component onClick={onClick} {...props}>
          {children}
        </Component>
      </GlobalHotKeys>
    </>
  );
};

export default ShortCutClick;
