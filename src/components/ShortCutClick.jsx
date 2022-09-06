import React from "react";
import { useId } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import { GlobalHotKeys, HotKeys, configure } from "react-hotkeys";
configure({
  customKeyCodes: {
    32: "SPACE_BAR",
  },
  ignoreTags: [],
});
const ShortCutClick = ({
  children,
  keys,
  onClick,
  Component,
  preventDefault,
  ...props
}) => {
  const id = useId();
  const keyMap = {
    ["SNAP_LEFT_" + id]: keys,
    PREVENT_DEFAULT: preventDefault,
    GRAB_CURSOR: { sequence: "SPACE_BAR", action: "keydown" },
    DEFAULT_CURSOR: { sequence: "SPACE_BAR", action: "keyup" },
  };

  const handlers = {
    PREVENT_DEFAULT: (e) => {
      e.preventDefault();
    },
    ["SNAP_LEFT_" + id]: (e) => {
      e.preventDefault();
      onClick();
    },
  };
  return (
    <>
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges={true} />
      <Component onClick={onClick} {...props}>
        {children}
      </Component>
    </>
  );
};

export const GlobalKeys = ({ handlers, ...props }) => {
  return (
    <GlobalHotKeys
      {...props}
      allowChanges={true}
      handlers={{
        PREVENT_DEFAULT: (e) => {
          e.preventDefault();
        },
        ...Object.keys(handlers).reduce((acc, key) => {
          acc[key.toUpperCase().replace("+", "_")] = handlers[key];
          return acc;
        }, {}),
      }}
      keyMap={{
        ...Object.keys(handlers).reduce((acc, key) => {
          acc[key.toUpperCase().replace("+", "_")] = key;
          return acc;
        }, {}),
        PREVENT_DEFAULT: "SPACE_BAR",
        GRAB_CURSOR: { sequence: "SPACE_BAR", action: "keydown" },
        DEFAULT_CURSOR: { sequence: "SPACE_BAR", action: "keyup" },
      }}
    />
  );
};

export default ShortCutClick;
