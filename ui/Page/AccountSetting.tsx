'use client';

import { changeSettings } from '@/services/auth/authSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/app';
import Field from '../Field';

const AccountSetting = () => {
  const settings = useSelector((s: RootState) => s.auth.settings);
  const dispatch = useDispatch();
  const handleSyncSetting = () => {};
  // dispatch(syncAccountSettingsThunk())
  //   .then(watchThunk)
  //   .then(() => pushToast.success("Save success"))
  //   .catch(() => pushToast.error("Save error please try again"))
  //   .finally(progressWatchPromise());
  const handleChange = (key: string, value: string) => {};
  // dispatch(changeSettings({ key, value }));
  const handleReset = () => {}; // dispatch(getUserInfo());
  return (
    <div>
      <div>
        <Field
          type="number"
          label="Limit card learn in day"
          value={settings.maxCardInDay.toString()}
          onChange={(v) => {
            handleChange('maxCardInDay', v);
          }}
          options={[]}
        />
        <Field
          type="select"
          options={[
            ['fade', 'Fade'],
            ['none', 'Disable'],
            ['slide', 'Slide'],
          ]}
          label="Animation Card"
          value={settings.cardAnimate}
          onChange={(v) => handleChange('cardAnimate', v)}
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
          onClick={() => handleSyncSetting()}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AccountSetting;
