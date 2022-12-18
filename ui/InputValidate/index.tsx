'use client';

import { IReactProps } from '@/interfaces/common';
import clsx from 'clsx';
import { useMemo, useRef } from 'react';
type ICheckList = Array<any>;
const defaultChecklist: ICheckList = [];
type IInputValidateProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  plug: any;
  value: string;
  name: string;
  type: 'email' | 'text' | 'number' | 'password';
  required?: boolean;
  checkList?: ICheckList;
  inputClass?: string;
  label?: string;
};

export const InputValidate: IReactProps<IInputValidateProps> = ({
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
  const checkValid = (value: string) => {
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        data-invalid={
          plug.isActivated() && Boolean(message.current) ? '' : undefined
        }
        data-valid={
          plug.isActivated() && !Boolean(message.current) ? '' : undefined
        }
        onChange={handleChange}
        {...props}
      />
      {plug.isActivated() && message.current && (
        <p className="text-sm text-red-400">{message.current}</p>
      )}
    </div>
  );
};
