import { SPECIAL_KEY } from "@/constants/index";
import useShortcut from "@hooks/useShortcut";
import React from "react";
import { useState } from "react";
import TranslationPopup from "./TranslationPopup";

const TranslationMain = () => {
  const [open, openSet] = useState(false);
  useShortcut(SPECIAL_KEY.Ctrl + "t", (e) => {
    e.preventDefault();
    openSet(true);
  });
  return (
    <>{open ? <TranslationPopup onClose={() => openSet(false)} /> : null}</>
  );
};

export default TranslationMain;
