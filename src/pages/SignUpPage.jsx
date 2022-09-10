import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import FormAuth from "../components/FormAuth";
import { pushToast } from "../components/Toast";
import { titlePage, watchThunk } from "../functions/common";
import useActivated from "../hooks/useActivated";
import { useValidate } from "../hooks/useValidate";
import { signupThunk } from "../services/auth/authSlice";
import { InputValidate } from "../components/InputValidate";
const SignUpPage = () => {
  titlePage("Sign up");
  const { plug, onSubmit } = useValidate();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });

  const resetField = () =>
    setData({ email: "", password: "", repeatPassword: "" });

  const handleSubmit = () => {
    dispatch(signupThunk({ email: data.email, password: data.password }))
      .then(watchThunk)
      .catch(({ error }) => {
        pushToast.error(error.message);
        resetField();
      });
  };

  useEffect(() => {}, []);
  return (
    <FormAuth title="Sign up" onSubmit={onSubmit(handleSubmit)}>
      <InputValidate
        type="email"
        placeholder="Email"
        className="mb-4"
        name="email"
        plug={plug}
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />
      <InputValidate
        type="password"
        className="mb-4"
        name="password"
        placeholder="Password"
        checkList={[
          {
            fn: (value) => value.length > 5,
            mess: "password too short",
          },
          {
            fn: (value) =>
              [/[a-z]+/.test(value), /[0-9]+/.test(value)].every((i) => i),
            mess: "password contain numbers",
          },
        ]}
        plug={plug}
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />
      <InputValidate
        type="password"
        className="mb-6"
        name="repeatpassword"
        checkList={[
          {
            fn: (value) => data.password === value,
            mess: "password doesn't match",
          },
        ]}
        placeholder="Confirm Password"
        plug={plug}
        value={data.repeatPassword}
        onChange={(e) => setData({ ...data, repeatPassword: e.target.value })}
      />
      <button className="w-full text-green-500 button">Create</button>
      <p className="text-center pt-4">
        or, <Link to="/login">log in</Link>
      </p>
    </FormAuth>
  );
};

export default SignUpPage;
