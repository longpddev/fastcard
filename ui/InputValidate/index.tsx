'use client';

import clsx from 'clsx';
import { useEffect, useMemo, useRef } from 'react';
const defaultChecklist = [];
export const InputValidate = ({
  onChange,
  plug,
  value,
  name,
  checkList = defaultChecklist,
  className,
  inputClass = '',
  label,
  ...props
}) => {
  const message = useRef('');
  const checkValid = (value) => {
    if (
      checkList.length > 0 &&
      checkList.every((validateFc) => {
        if (validateFc.fn(value)) return true;

        plug.globe.current[name] = false;
        message.current = validateFc.mess;
        return false;
      })
    ) {
      plug.globe.current[name] = true;

      message.current = '';
    }
  };
  const handleChange = (e) => {
    onChange && onChange(e);
  };
  useMemo(() => {
    checkValid(value);
  }, [value, checkList]);

  return (
    <div className={className}>
      {label && (
        <label htmlFor="" className="mb-1 inline-block">
          {label}
        </label>
      )}
      <input
        value={value}
        className={clsx('input', inputClass, {
          'first-active': plug.isActivated(),
        })}
        name={name}
        invalid={
          plug.isActivated() && Boolean(message.current) ? '' : undefined
        }
        valid={plug.isActivated() && !Boolean(message.current) ? '' : undefined}
        onChange={handleChange}
        {...props}
      />
      {plug.isActivated() && message.current && (
        <p className="text-sm text-red-400">{message.current}</p>
      )}
    </div>
  );
};
