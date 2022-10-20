import { checklistValidate, watchThunk } from "@/functions/common";
import { useDispatch } from "react-redux";
import Field from "@components/Field/Field";
import { InputValidate } from "@components/InputValidate/index";
import { useValidate } from "@hooks/useValidate";
import {
  changePasswordThunk,
  updateAccountThunk,
} from "@services/auth/authSlice";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { pushFastToast } from "@components/Toast/core";

const AccountDetail = () => {
  const accDetail = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const { plug, onSubmit } = useValidate();
  const { plug: passwordPlug, onSubmit: onPasswordSubmit } = useValidate();
  const [name, nameSet] = useState("");
  const [oldPassword, oldPasswordSet] = useState("");
  const [newPassword, newPasswordSet] = useState("");
  const [repeatPassword, repeatPasswordSet] = useState("");
  const handleSave = onSubmit(() =>
    dispatch(updateAccountThunk({ username: name }))
      .then(watchThunk)
      .then(() => {
        pushFastToast.success("User info saved");
      })
      .catch((e) => {
        nameSet("");
        pushFastToast.error(
          e?.error?.message ? e.error.message : "User info save error"
        );
      })
  );

  const handleSavePassword = onPasswordSubmit(() =>
    dispatch(changePasswordThunk({ oldPassword, newPassword }))
      .then(watchThunk)
      .then(() => {
        resetFieldPassword();
        pushFastToast.success("change password success");
      })
      .catch((e) => {
        pushFastToast.error(
          e?.error?.message
            ? e.error.message
            : "Change password error please try again"
        );
        console.error(e);
      })
  );
  const handleReset = () => {
    nameSet(accDetail.name);
    resetFieldPassword();
  };

  const resetFieldPassword = () => {
    oldPasswordSet("");
    newPasswordSet("");
    repeatPasswordSet("");
  };

  useEffect(() => {
    if (accDetail.name) nameSet(accDetail.name);
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
              fn: (value) => value.trim().length > 2,
              mess: "User name must at least 2 character",
            },
          ]}
          onChange={(e) => nameSet(e.target.value)}
        />
      </div>
      <p className="text-center text-slate-200 mt-6">Change password</p>
      <div className="mb-4">
        <InputValidate
          type="text"
          plug={passwordPlug}
          name="oldpassword"
          label="Old password"
          value={oldPassword}
          onChange={(e) => oldPasswordSet(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <InputValidate
          type="text"
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
          type="text"
          plug={passwordPlug}
          label="Repeat password"
          name="repeatpassword"
          checkList={checklistValidate.repeatPassword(newPassword)}
          value={repeatPassword}
          onChange={(e) => repeatPasswordSet(e.target.value)}
        />
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="button text-slate-400 mx-2"
          onClick={() => handleReset()}
        >
          Reset
        </button>
        <button
          className="button text-green-400 mx-2"
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
