import { ATTRIBUTE_SHORTCUT_BUTTON } from "@/constants/index";
import useShortcut from "@hooks/useShortcut";
import React, { useEffect, useRef } from "react";

const ButtonShortCut = ({ onClick, shortcut = "", ...props }) => {
  if (typeof shortcut !== "string") throw new Error("shortcut must is string");

  const ref = useRef();
  const handleClick = useRef();
  handleClick.current = () => {
    const el = ref.current;

    if (el) {
      el.classList.add("animate-click-button");
    }
    setTimeout(() => onClick(), 100);
  };

  useShortcut(shortcut, (e) => {
    e.preventDefault();
    handleClick.current();
  });

  useEffect(() => {
    const el = ref.current;

    if (!el) return;
    const handleAnimationEnd = () => {
      el.classList.contains("animate-click-button") &&
        el.classList.remove("animate-click-button");
    };
    el.addEventListener("animationend", handleAnimationEnd);

    return () => el.removeEventListener("animationend", handleAnimationEnd);
  }, []);
  return (
    <button
      ref={ref}
      {...{ [ATTRIBUTE_SHORTCUT_BUTTON]: shortcut }}
      onClick={handleClick.current}
      {...props}
    ></button>
  );
};

export default ButtonShortCut;
