import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FormAuth from "../components/FormAuth";
import { InputValidate } from "../components/InputValidate";
import { titlePage, watchThunk } from "../functions/common";
import { useValidate } from "../hooks/useValidate";
import { loginThunk } from "../services/auth/authSlice";
import { pushToast } from "../components/Toast/core";
import { useLogin } from "../hooks/useLogin";
import { progressWatchPromise } from "../components/ProgressGlobal";
const LoginPage = () => {
  titlePage("login");
  const { plug, onSubmit } = useValidate();
  const { isLogin } = useLogin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "demo@gmail.com ",
    password: "admin123",
  });

  const resetPassword = () => setData({ ...data, password: "" });

  useEffect(() => {
    if (isLogin) navigate("/");
  }, [isLogin]);
  const handleSubmit = () => {
    dispatch(loginThunk(data))
      .then(watchThunk)
      .then(() => {
        window.open(location.origin, "_self");
      })
      .catch(({ error }) => {
        resetPassword();
        pushToast.error("Email or password is wrong");
      })
      .finally(progressWatchPromise());
  };
  return (
    <FormAuth title="Log in" onSubmit={onSubmit(handleSubmit)}>
      <InputValidate
        plug={plug}
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        name="email"
        type="email"
        required
        placeholder="Email"
        className="mb-4"
      />
      <InputValidate
        plug={plug}
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        name="password"
        type="password"
        required
        className="mb-6"
        placeholder="Password"
      />
      <button className="w-full text-green-500 button">Submit</button>
      <p className="text-center pt-6">
        or, <Link to="/sign-up">sign up</Link>
      </p>
    </FormAuth>
  );
};

export default LoginPage;
