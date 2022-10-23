import { KEY_NAME, SPECIAL_KEY } from "@/constants/index";
import useShortcut from "@hooks/useShortcut";
import React from "react";
import { useLogin } from "../../hooks/useLogin";

const NavigateSiteMain = () => {
  const { isLogin } = useLogin();
  if (!isLogin) return null;
  return null;
};

export default NavigateSiteMain;
