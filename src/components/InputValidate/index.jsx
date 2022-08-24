import clsx from "clsx";
import { useEffect, useRef } from "react";

export const InputValidate = ({
  onChange,
  plug,
  value,
  name,
  checkList = [],
  className,
  inputClass = "",
  ...props
}) => {
  const message = useRef("");
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
      message.current = "";
    }
  };
  const handleChange = (e) => {
    const val = e.target.value;
    checkValid(val);
    onChange && onChange(e);
  };

  useEffect(() => {
    checkValid(value);
  }, []);
  return (
    <div className={className}>
      <input
        value={value}
        className={clsx(inputClass, {
          "first-active": plug.isActivated(),
        })}
        name={name}
        invalid={
          plug.isActivated() && Boolean(message.current) ? "" : undefined
        }
        valid={plug.isActivated() && !Boolean(message.current) ? "" : undefined}
        onChange={handleChange}
        {...props}
      />
      {plug.isActivated() && message.current && (
        <p className="text-sm text-red-400">{message.current}</p>
      )}
    </div>
  );
};
