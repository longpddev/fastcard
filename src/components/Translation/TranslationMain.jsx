import { SPECIAL_KEY } from "@/constants/index";
import { useLogin } from "@hooks/useLogin";
import useShortcut from "@hooks/useShortcut";
import React from "react";
import { useState } from "react";
import TranslationPopup from "./TranslationPopup";

const TranslationMain = () => {
  const [open, openSet] = useState(false);
  const { isLogin } = useLogin();
  useShortcut(SPECIAL_KEY.Ctrl + "t", (e) => {
    e.preventDefault();
    openSet(true);
  });

  if (!isLogin) return null;
  return (
    <>{open ? <TranslationPopup onClose={() => openSet(false)} /> : null}</>
  );
};

export default TranslationMain;
