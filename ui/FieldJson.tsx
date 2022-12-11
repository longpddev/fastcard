'use client';

import React, { useMemo, useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Markdown from '@/ui/Markdown';
import { pushFastToast } from '@/ui/Toast';
import IconCircle from '@/ui/IconCircle';
import useShortcut from '@/hooks/useShortcut';
import { SHORTCUT_RE_UNDO, SHORTCUT_UNDO } from '@/constants/index';
import { IReactProps } from '@/interfaces/common';

export interface ICommandFn {
  undo: () => void;
  execute: () => void;
}
export interface IFieldJsonFormat {
  time: number;
  timeFormat: string;
  text: string;
}
function parseTranscript(value: string) {
  let parsed: Array<IFieldJsonFormat>;
  try {
    parsed = JSON.parse(value) as Array<IFieldJsonFormat>;
  } catch (e) {
    throw "We can't parse transcript please check format json";
  }

  parsed.forEach((item, index) => {
    if (!('time' in item))
      throw `Missing "time" field in the ${index + 1}th transcript`;
    if (!('text' in item))
      throw `Missing "text" field in the ${index + 1}th transcript`;
    if (!('timeFormat' in item))
      throw `Missing "timeFormat" field in the ${index + 1}th transcript`;

    if (typeof item.time !== 'number')
      throw `"time" field must is number in the ${index + 1}th transcript`;
    if (typeof item.timeFormat !== 'string')
      throw `"timeFormat" field must is text in the ${index + 1}th transcript`;
    if (typeof item.text !== 'string')
      throw `"text" field must is text in the ${index + 1}th transcript`;
  });

  return parsed;
}

const FieldJson: IReactProps<{
  value: string;
  valueSet: (s: string) => void;
}> = ({ value, valueSet }) => {
  const [innerValue, innerValueSet] = useState('');
  const [isPrev, isPrevSet] = useState(false);
  const [parse, parseSet] = useState<Array<IFieldJsonFormat>>([]);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
            title="type here"
            onBlur={() => {
              try {
                parseTranscript(innerValue);
                valueSet(innerValue);
              } catch (error) {
                pushFastToast.error(error as string);
                valueSet('');
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
              className="icon-center-button relative mr-2 h-8 w-8 rounded-md bg-slate-900 bg-opacity-80 px-2 py-1 hover:text-green-400"
              title="Apply"
            >
              <i className="fa-solid fa-check text-xl"></i>
            </button>
          )}
          <button
            className="icon-center-button relative h-8 w-8 rounded-md bg-slate-900 bg-opacity-80 px-2 py-1 hover:text-orange-400"
            title="Preview"
            onClick={() => {
              if (!isPrev) {
                try {
                  const result = parseTranscript(value);
                  parseSet(result);
                } catch (error) {
                  pushFastToast.error(error as string);
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

      <div className="text-sm text-gray-400">
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

const Prev: IReactProps<{
  parse: Array<IFieldJsonFormat>;
  parseSet: (v: Array<IFieldJsonFormat>) => void;
}> = ({ parse, parseSet }) => {
  const command = useRef(
    {} as {
      goto: (n: number) => void;
      add: (a: ICommandFn) => void;
      list: Array<ICommandFn>;
    },
  );

  if (!command.current) {
    command.current = (() => {
      let list: Array<ICommandFn> = [];
      let point = -1;
      const isExist = (pt: number) => {
        if (pt > list.length - 1) return false;
        if (pt < 0) return false;
        return true;
      };
      const goto = (nextOrPrev: number) => {
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
      const add = ({ undo, execute }: ICommandFn) => {
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
  const handleTranscriptChange = (val: string, index: number) => {
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

  const handleDelete = (index: number) => {
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
    <div className="max-h-[300px] overflow-auto border border-slate-400 pr-4">
      <table className="table-border-full w-full">
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
                <button onClick={() => handleDelete(index)} title="remove">
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

const Editable: IReactProps<{
  value: string;
  valueSet: (v: string) => void;
}> = ({ value, valueSet }) => {
  const [isEdit, isEditSet] = useState(false);
  const [_, rerender] = useState({});
  const data = useRef('');
  useMemo(() => {
    data.current = value;
  }, [value]);
  const handleDone = () => {
    valueSet(data.current);
    isEditSet(false);
  };
  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleDone();
    }
  };
  return isEdit ? (
    <input
      type="text"
      className="input rounded-none p-0"
      title="type here"
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
