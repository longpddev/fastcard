import React, { useMemo, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Markdown from "@components/Markdown";
import { pushFastToast } from "@components/Toast";
import IconCircle from "@components/IconCircle";
import useShortcut from "@hooks/useShortcut";
import { SHORTCUT_RE_UNDO, SHORTCUT_UNDO } from "@/constants";

function parseTranscript(value) {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch (e) {
    throw "We can't parse transcript please check format json";
  }

  parsed.forEach((item, index) => {
    if (!("time" in item))
      throw `Missing "time" field in the ${index + 1}th transcript`;
    if (!("text" in item))
      throw `Missing "text" field in the ${index + 1}th transcript`;
    if (!("timeFormat" in item))
      throw `Missing "timeFormat" field in the ${index + 1}th transcript`;

    if (typeof item.time !== "number")
      throw `"time" field must is number in the ${index + 1}th transcript`;
    if (typeof item.timeFormat !== "string")
      throw `"timeFormat" field must is text in the ${index + 1}th transcript`;
    if (typeof item.text !== "string")
      throw `"text" field must is text in the ${index + 1}th transcript`;
  });

  return parsed;
}

const FieldJson = ({ value, valueSet }) => {
  const [innerValue, innerValueSet] = useState("");
  const [isPrev, isPrevSet] = useState(false);
  const [parse, parseSet] = useState([]);
  const handleChange = (e) => {
    const val = e.target.value;
    innerValueSet(val);
  };

  useEffect(() => {
    innerValueSet(value);
  }, [value]);
  return (
    <>
      <div className="relative">
        {isPrev ? (
          <Prev parse={parse} parseSet={parseSet} />
        ) : (
          <textarea
            className="input min-h-[300px]"
            value={innerValue}
            onChange={handleChange}
            onBlur={() => {
              try {
                parseTranscript(innerValue);
                valueSet(innerValue);
              } catch (error) {
                pushFastToast.error(error);
                valueSet("");
                return;
              }
            }}
          ></textarea>
        )}
        <div className=" absolute top-1 right-1">
          {isPrev && (
            <button
              onClick={() => {
                const result = JSON.stringify(parse);
                valueSet(result);
                innerValueSet(result);
                isPrevSet(!isPrev);
              }}
              className="px-2 py-1 w-8 h-8 rounded-md bg-slate-900 bg-opacity-80 relative mr-2 hover:text-green-400 icon-center-button"
              title="Apply"
            >
              <i className="fa-solid fa-check text-xl"></i>
            </button>
          )}
          <button
            className="px-2 py-1 w-8 h-8 rounded-md bg-slate-900 bg-opacity-80 relative hover:text-orange-400 icon-center-button"
            title="Preview"
            onClick={() => {
              if (!isPrev) {
                try {
                  const result = parseTranscript(value);
                  parseSet(result);
                } catch (error) {
                  pushFastToast.error(error);
                  parseSet([]);
                  return;
                }
              }
              isPrevSet(!isPrev);
            }}
          >
            {isPrev ? (
              <i className="fa-solid fa-eye-slash absolute"></i>
            ) : (
              <i className="fa-solid fa-eye absolute"></i>
            )}
          </button>
        </div>
      </div>

      <div className="text-gray-400 text-sm">
        <Markdown>
          {`Contains 3 field:
- __timeFormat__: Time will show
- __text__: translate text 
- __time__: float number, time exactly transcript will show

Exp:
\`[
  {
    "timeFormat": "0:04",
    "text": "think and speak in English.",
    "time": 4.53
  }
]\`
`}
        </Markdown>
      </div>
    </>
  );
};

const Prev = ({ parse, parseSet }) => {
  const command = useRef();

  if (!command.current) {
    command.current = (() => {
      let list = [];
      let point = -1;
      const isExist = (pt) => {
        if (pt > list.length - 1) return false;
        if (pt < 0) return false;
        return true;
      };
      const goto = (nextOrPrev) => {
        const newPoint = point + nextOrPrev;
        if (list.length === 0) return;

        if (nextOrPrev < 0) {
          if (!isExist(point)) return;
          const { undo } = list[point];
          undo();
        }

        if (nextOrPrev > 0) {
          if (!isExist(newPoint)) return;
          const { execute } = list[newPoint];
          execute();
        }

        point = newPoint;
      };
      const add = ({ undo, execute }) => {
        list = list.filter((_, index) => index <= point);
        list.push({ undo, execute });
        execute();
        point++;
      };
      return {
        goto,
        list,
        add,
      };
    })();
  }
  const handleTranscriptChange = (val, index) => {
    command.current.add({
      undo: () => {
        parseSet(parse);
      },
      execute: () => {
        const parseClone = structuredClone(parse);
        parseClone[index].text = val;
        parseSet(parseClone);
      },
    });
  };

  const handleDelete = (index) => {
    command.current.add({
      undo: () => {
        parseSet(parse);
      },
      execute: () => {
        parseSet(parse.filter((_, i) => i !== index));
      },
    });
  };

  useShortcut(SHORTCUT_UNDO, () => command.current.goto(-1));
  useShortcut(SHORTCUT_RE_UNDO, () => command.current.goto(1));
  return (
    <div className="overflow-auto max-h-[300px] border-slate-400 border pr-4">
      <table className="w-full table-border-full">
        <tbody>
          {parse.map((item, index) => (
            <tr key={index}>
              <td>{item.timeFormat}</td>
              <td>
                <Editable
                  value={item.text}
                  valueSet={(val) => handleTranscriptChange(val, index)}
                />
              </td>
              <td>
                <button onClick={() => handleDelete(index)}>
                  <IconCircle
                    wrapClass="text-[12px] hover:text-red-400"
                    className="fas fa-trash-can"
                    size="md"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Editable = ({ value, valueSet }) => {
  const [isEdit, isEditSet] = useState(false);
  const [_, rerender] = useState({});
  const data = useRef();
  useMemo(() => {
    data.current = value;
  }, [value]);
  const handleDone = () => {
    valueSet(data.current);
    isEditSet(false);
  };
  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleDone();
    }
  };
  return isEdit ? (
    <input
      type="text"
      className="input p-0 rounded-none"
      value={data.current}
      autoFocus={true}
      onBlur={() => handleDone()}
      onKeyDown={handleKeydown}
      onChange={(e) => {
        data.current = e.target.value;
        rerender({});
      }}
    />
  ) : (
    <button onClick={() => isEditSet(true)}>{value}</button>
  );
};

export default FieldJson;
