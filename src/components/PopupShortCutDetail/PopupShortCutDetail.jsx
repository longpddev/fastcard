import { useLogin } from "@hooks/useLogin";
import React from "react";
import PopupShortCutDetailMain from "./PopupShortCutDetailMain";

const PopupShortCutDetail = () => {
  const { isLogin } = useLogin();

  if (!isLogin) return null;
  return <PopupShortCutDetailMain />;
};

export default PopupShortCutDetail;
