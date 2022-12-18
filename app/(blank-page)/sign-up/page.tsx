'use client';

import { useValidate } from '@/hooks/useValidate';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { pushToast } from '@/ui/Toast';
import { progressWatchPromise } from '@/ui/ProgressGlobal';
import FormAuth from '@/ui/FormAuth';
import { InputValidate } from '@/ui/InputValidate';
import { checklistValidate, globalNavigate } from '@/functions/common';
import Link from 'next/link';
import { signUpAction, signupApi } from '@/services/auth/authSlice';
import { ROUTER } from '@/constants/index';

const page = () => {
  const { plug, onSubmit } = useValidate();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    email: '',
    password: '',
    repeatPassword: '',
  });

  const resetField = () =>
    setData({ email: '', password: '', repeatPassword: '' });

  const handleSubmit = () => {
    signupApi(data)
      .then((response) => {
        dispatch(signUpAction(response));
        globalNavigate.current?.push(ROUTER.home);
        pushToast.success('sign up success');
      })
      .catch((error) => {
        console.log(error);
        pushToast.error(error.message);
        resetField();
      })
      .finally(progressWatchPromise());
  };

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
        checkList={checklistValidate.password}
        plug={plug}
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />
      <InputValidate
        type="password"
        className="mb-6"
        name="repeatpassword"
        checkList={checklistValidate.repeatPassword(data.password)}
        placeholder="Confirm Password"
        plug={plug}
        value={data.repeatPassword}
        onChange={(e) => setData({ ...data, repeatPassword: e.target.value })}
      />
      <button className="button w-full text-green-500">Create</button>
      <p className="pt-4 text-center">
        or, <Link href="/login">log in</Link>
      </p>
    </FormAuth>
  );
};

export default page;
