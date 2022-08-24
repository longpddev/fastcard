import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { pushToast } from "../Toast";

const HasLogin = ({ children, ...props }) => {
  const { isLogin, loading } = useLogin();
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (isLogin) return;
  //   // pushToast.warning("Please login first");
  // }, [loading]);
  useEffect(() => {
    if (isLogin || loading) return;
    navigate("/login", { replace: true });
  }, [isLogin, loading]);
  return isLogin ? children : null;
};

export default HasLogin;
