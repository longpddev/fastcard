import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
const KEY_IGNORE = {
  Backspace: "Backspace",
  Control: "Control",
  Meta: "Meta",
  Alt: "Alt",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  Shift: "Shift",
  Enter: "Enter",
  Escape: "Escape",
  F1: "F1",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  Tab: "Tab",
  CapsLock: "CapsLock",
};

const TypeTranslate = ({
  className,
  text,
  onDone,
  style,
  isFocus,
  isFocusSet,
}) => {
  const isProgress = useRef(false);
  isProgress.current = false;
  const ref = useRef();
  const [currentPoint, currentPointSet] = useState(0);
  const arrChar = useMemo(() => {
    return text.split("");
  }, [text]);

  const arrCharMark = useMemo(() => {
    return arrChar.map(() => 0);
  }, [arrChar]);

  const handleKeydown = (e) => {
    if (isProgress.current === true) {
      console.log("you type so fast, we dont have speed to control process");
      return;
    }

    e.preventDefault();
    const key = e.key;
    const currentKey = arrChar[currentPoint];
    const isNextable = arrChar.length > currentPoint + 1;
    if (key in KEY_IGNORE) return;
    if (key !== currentKey) {
      arrCharMark[currentPoint] === 0 && (arrCharMark[currentPoint] = -1);
      return;
    }
    if (isNextable) {
      arrCharMark[currentPoint] === 0 && (arrCharMark[currentPoint] = 1);
      currentPointSet((prev) => prev + 1);
    } else {
      onDone();
    }

    isProgress.current = true;
  };

  useEffect(() => {
    ref.current && ref.current.focus();
    console.log(currentPoint);
  }, []);

  return (
    <div
      tabIndex={0}
      className={clsx(
        className,
        "outline-unset text-slate-800 focus-visible:outline-none",
        {
          "border border-sky-400": isFocus,
          "border border-transparent cursor-pointer": !isFocus,
        }
      )}
      onKeyDown={handleKeydown}
      onFocus={isFocusSet.bind(undefined, true)}
      onBlur={isFocusSet.bind(undefined, false)}
      ref={ref}
      style={{
        ...style,
        "text-shadow":
          "black .5px 0px,black -.5px 0px, black 0px .5px,black 0px -.5px",
      }}
    >
      {arrChar.map((item, index) => (
        <>
          <Point isActive={isFocus && index === currentPoint}></Point>
          <span
            className={clsx({
              "text-slate-300 opacity-40": arrCharMark[index] === 0,
              "text-red-500": arrCharMark[index] === -1,
              "text-sky-400": arrCharMark[index] === 1,
            })}
            key={index}
          >
            {item}
          </span>
        </>
      ))}
    </div>
  );
};

const Point = ({ isActive }) => {
  const ref = useRef();

  if (!isActive) return null;

  return (
    <span className="relative text-white">
      <span
        className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] point-animate"
        style={{
          "text-shadow": "none",
        }}
      />
    </span>
  );
};
export default TypeTranslate;
