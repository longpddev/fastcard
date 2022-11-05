import { ATTRIBUTE_SHORTCUT_BUTTON } from "@/constants/index";
import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useShortcut from "@hooks/useShortcut";
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
  shortcut,
  isFocusSet,
}) => {
  const [tmpText, tmpTextSet] = useState("");
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
  const handleTyping = (char) => {
    const currentKey = arrChar[currentPoint];
    const isNextable = arrChar.length > currentPoint + 1;
    if (char in KEY_IGNORE) return false;
    if (char !== currentKey) {
      arrCharMark[currentPoint] === 0 && (arrCharMark[currentPoint] = -1);
      return false;
    }
    if (isNextable) {
      arrCharMark[currentPoint] === 0 && (arrCharMark[currentPoint] = 1);
      currentPointSet((prev) => prev + 1);
    } else {
      onDone();
      tmpTextSet("");
    }

    isProgress.current = true;
    return true;
  };

  useShortcut(shortcut, (e) => {
    e.preventDefault();
    isFocusSet(true);
  });
  useEffect(() => {
    if (!isFocus) return;
    ref.current && ref.current.focus();
  }, [isFocus]);

  const renderWords = arrChar
    // create component by letter
    .map((item, index) => {
      return {
        letter: item,
        component: (
          <span key={index} className="relative">
            <Point isActive={index === currentPoint} />
            <span
              className={clsx({
                "text-slate-300 opacity-50": arrCharMark[index] === 0,
                "text-red-500": arrCharMark[index] === -1,
                "text-sky-400": arrCharMark[index] === 1,
              })}
            >
              {item}
            </span>
          </span>
        ),
      };
    })
    // group letter by signal which signal is space
    .reduce((acc, item) => {
      if (acc.length === 0) {
        acc.push([]);
      }

      const last = acc[acc.length - 1];

      if (item.letter === " ") {
        acc.push([item], []);
      } else {
        last.push(item);
      }

      return acc;
    }, [])
    // use group above to create group component
    .map((item) => {
      const word = item.map((l) => l.letter).join("");
      return (
        <span
          className={word.trim() ? "whitespace-nowrap" : ""}
          word={item.map((l) => l.letter).join("")}
        >
          {item.map((c) => c.component)}
        </span>
      );
    });

  return (
    <div
      tabIndex={0}
      {...{ [ATTRIBUTE_SHORTCUT_BUTTON]: shortcut }}
      className={clsx(
        className,
        "outline-unset text-slate-800 focus-visible:outline-none",
        {
          "border border-sky-400": isFocus,
          "border border-transparent cursor-pointer": !isFocus,
        }
      )}
      style={{
        ...style,
        textShadow:
          "black .5px 0px,black -.5px 0px, black 0px .5px,black 0px -.5px",
      }}
    >
      <input
        type="text"
        ref={ref}
        // onKeyDown={handleKeydown}
        onFocus={isFocusSet.bind(undefined, true)}
        onBlur={isFocusSet.bind(undefined, false)}
        value={tmpText}
        onChange={(e) => {
          const val = e.target.value;
          if (!val) {
            tmpTextSet("");
            return;
          }
          if (handleTyping(val[val.length - 1])) {
            tmpTextSet(val);
          }
        }}
        className="absolute inset-0 w-full h-full bg-orange-400 text-transparent opacity-0"
      />
      <div>{renderWords}</div>
    </div>
  );
};

const Point = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <i
      className="absolute left-0 top-1/2 translate-x-[-50%] translate-y-[-50%] text-white point-animate"
      style={{
        textShadow: "none",
      }}
    />
  );
};
export default TypeTranslate;
