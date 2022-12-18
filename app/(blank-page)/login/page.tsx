'use client';

import { useLogin } from '@/hooks/useLogin';
import { useValidate } from '@/hooks/useValidate';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { pushToast } from '@/ui/Toast';
import { progressWatchPromise } from '@/ui/ProgressGlobal';
import FormAuth from '@/ui/FormAuth';
import { InputValidate } from '@/ui/InputValidate';
import Link from 'next/link';
import { loginAction, loginApi } from '@/services/auth/authSlice';

const page = () => {
  const { plug, onSubmit } = useValidate();
  const { isLogin } = useLogin();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    email: 'demo@gmail.com ',
    password: 'admin123',
  });

  const resetPassword = () => setData({ ...data, password: '' });

  useEffect(() => {
    if (isLogin) {
      window.open('/', '_self');
    }
  }, [isLogin]);
  const handleSubmit = () => {
    loginApi(data)
      .then((response) => {
        dispatch(loginAction(response));
      })
      .then(() => {
        pushToast.success('login success');
        // window.open(location.origin, "_self");
      })
      .catch(() => {
        resetPassword();
        pushToast.error('Email or password is wrong');
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
      <button className="button w-full text-green-500">Submit</button>
      <p className="pt-6 text-center">
        or, <Link href="/sign-up">sign up</Link>
      </p>
    </FormAuth>
  );
};

export default page;
