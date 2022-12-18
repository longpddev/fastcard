'use client';

import { checklistValidate } from '@/functions/common';
import { useValidate } from '@/hooks/useValidate';
import { changePasswordApi, updateAccountApi } from '@/services/auth/authSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/app';
import { InputValidate } from '../InputValidate';
import { pushFastToast } from '../Toast';

const AccountDetail = () => {
  const accDetail = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();
  const { plug, onSubmit } = useValidate();
  const { plug: passwordPlug, onSubmit: onPasswordSubmit } = useValidate();
  const [name, nameSet] = useState('');
  const [oldPassword, oldPasswordSet] = useState('');
  const [newPassword, newPasswordSet] = useState('');
  const [repeatPassword, repeatPasswordSet] = useState('');
  const handleSave = onSubmit(() =>
    updateAccountApi({ username: name })
      .then(() => {
        pushFastToast.success('User info saved');
      })
      .catch((e) => {
        nameSet('');
        pushFastToast.error(
          e?.error?.message ? e.error.message : 'User info save error',
        );
      }),
  );

  const handleSavePassword = onPasswordSubmit(() =>
    changePasswordApi({ oldPassword, newPassword })
      .then(() => {
        resetFieldPassword();
        pushFastToast.success('change password success');
      })
      .catch((e) => {
        pushFastToast.error(
          e?.error?.message
            ? e.error.message
            : 'Change password error please try again',
        );
      }),
  );
  const handleReset = () => {
    accDetail && nameSet(accDetail.name);
    resetFieldPassword();
  };

  const resetFieldPassword = () => {
    oldPasswordSet('');
    newPasswordSet('');
    repeatPasswordSet('');
  };

  useEffect(() => {
    if (accDetail && accDetail.name) nameSet(accDetail.name);
  }, [accDetail]);
  return (
    <div>
      <div className="mb-4">
        <InputValidate
          type="text"
          label="User name"
          name="username"
          plug={plug}
          value={name}
          checkList={[
            {
              fn: (value: string) => value.trim().length > 2,
              mess: 'User name must at least 2 character',
            },
          ]}
          onChange={(e) => nameSet(e.target.value)}
        />
      </div>
      <p className="mt-6 text-center text-slate-200">Change password</p>
      <div className="mb-4">
        <InputValidate
          type="password"
          plug={passwordPlug}
          name="oldpassword"
          label="Old password"
          value={oldPassword}
          onChange={(e) => oldPasswordSet(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <InputValidate
          type="password"
          plug={passwordPlug}
          label="New password"
          name="newpassword"
          value={newPassword}
          checkList={checklistValidate.password}
          onChange={(e) => newPasswordSet(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <InputValidate
          type="password"
          plug={passwordPlug}
          label="Repeat password"
          name="repeatpassword"
          checkList={checklistValidate.repeatPassword(newPassword)}
          value={repeatPassword}
          onChange={(e) => repeatPasswordSet(e.target.value)}
        />
      </div>
      <div className="mt-4 flex justify-center">
        <button
          className="button mx-2 text-slate-400"
          onClick={() => handleReset()}
        >
          Reset
        </button>
        <button
          className="button mx-2 text-green-400"
          onClick={() => {
            handleSave();
            oldPassword.length > 0 &&
              newPassword.length > 0 &&
              repeatPassword.length > 0 &&
              handleSavePassword();
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AccountDetail;
