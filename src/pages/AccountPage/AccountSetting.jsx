import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { watchThunk } from "../../functions/common";
import {
  changeSettings,
  getUserInfo,
  syncAccountSettingsThunk,
} from "../../services/auth/authSlice";
import { pushToast } from "../../components/Toast/core";
import Field from "../../components/Field/Field";
const AccountSetting = () => {
  const settings = useSelector((s) => s.auth.settings);
  const dispatch = useDispatch();
  const handleSyncSetting = () =>
    dispatch(syncAccountSettingsThunk())
      .then(watchThunk)
      .then(() => pushToast.success("Save success"))
      .catch(() => pushToast.error("Save error please try again"));
  const handleChange = (key, value) => dispatch(changeSettings({ key, value }));
  const handleReset = () => dispatch(getUserInfo());
  return (
    <div>
      <div>
        <Field
          type="number"
          label="Limit card learn in day"
          value={settings.maxCardInDay}
          onChange={(v) =>
            handleChange("maxCardInDay", v) || settings.maxCardInDay
          }
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
          onClick={() => handleSyncSetting()}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AccountSetting;
