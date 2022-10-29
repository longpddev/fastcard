import { KEY_NAME, SPECIAL_KEY } from "@/constants/index";
import { firstCapitalize, getTextSelect } from "@/functions/common";
import ButtonShortCut from "@components/ButtonShortCut";
import LoadingIcon from "@components/LoadingIcon";
import Popup from "@components/Popup/index";
import When from "@components/When";
import useShortcut from "@hooks/useShortcut";
import useWordDefinitions from "@hooks/useWordDefinitions";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import PopupWordDefinitionsContent from "./PopupWordDefinitionsContent";

const PopupWordDefinitionsPopup = ({ onClose, words = "" }) => {
  const [stack, stackSet] = useState([]);
  const forwardVar = useRef({});
  const [stackPoint, stackPointSet] = useState(0);
  const [word, wordSet] = useState(words);
  const [typing, typingSet] = useState(words ? false : true);
  let { data, isLoading, isNotfound } = useWordDefinitions(typing ? "" : word);

  forwardVar.current = {
    stack,
    stackPoint,
    word,
    typing,
    data,
  };

  const handleWordSet = (word) => {
    wordSet(word);
    const newList = [...stack, word];
    stackSet(newList);
    stackPointSet(newList.length - 1);
  };

  useShortcut(SPECIAL_KEY.Ctrl + "s", (e) => {
    e.preventDefault();
    typingSet(true);
  });

  const handleNavigateStack = (jump) => (e) => {
    const fw = forwardVar.current;
    const targetPoint = fw.stackPoint + jump;
    if (targetPoint < 0 || targetPoint > fw.stack.length - 1) return;
    wordSet(fw.stack[targetPoint]);
    stackPointSet(targetPoint);
  };
  console.log(stackPoint);
  return (
    <Popup maxWidth={800} open={true} setOpen={onClose}>
      <When
        if={typing}
        component={PopupWordDefinitionsSearchBy}
        searchBy={(w) => {
          handleWordSet(w);
          typingSet(false);
        }}
      />
      <When if={!typing && isLoading}>
        <div className="flex items-center justify-center h-24 w-full">
          <LoadingIcon className="text-2xl animate-spin text-sky-400"></LoadingIcon>
        </div>
      </When>
      <When if={!typing && !isLoading}>
        {() => (
          <div>
            <h2 className="text-center relative font-semibold text-slate-200 text-2xl my-4">
              {stackPoint !== 0 ? (
                <div className=" absolute top-0 left-0 flex">
                  <ButtonShortCut
                    shortcut={SPECIAL_KEY.Command + KEY_NAME.ArrowLeft}
                    onClick={handleNavigateStack(-1)}
                    className="icon-center-button relative w-10 h-8"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </ButtonShortCut>
                </div>
              ) : null}
              {firstCapitalize(word)}

              {stackPoint !== stack.length - 1 ? (
                <div className="absolute top-0 right-0 flex">
                  <ButtonShortCut
                    shortcut={SPECIAL_KEY.Command + KEY_NAME.ArrowRight}
                    onClick={handleNavigateStack(1)}
                    className="icon-center-button relative w-10 h-8"
                  >
                    <i className="fas fa-arrow-right"></i>
                  </ButtonShortCut>
                </div>
              ) : null}
            </h2>
            <PopupWordDefinitionsContent
              onDefineMore={(text) => {
                for (const i of stack) {
                  if (stack[i] === text) {
                    stackPointSet(i);
                    wordSet(text);
                    return;
                  }
                }
                handleWordSet(text);
              }}
              data={data}
              originalText={word}
            />
          </div>
        )}
      </When>
    </Popup>
  );
};

const PopupWordDefinitionsSearchBy = ({ searchBy }) => {
  const [word, wordSet] = useState(() => getTextSelect());
  const bypass = useRef();
  bypass.current = word;
  useShortcut(KEY_NAME.Enter, (e) => {
    e.preventDefault();
    searchBy && searchBy(bypass.current);
  });
  return (
    <div className="p-4">
      <h2 className="text-center font-semibold text-2xl mb-4">
        Word Definitions
      </h2>
      <input
        type="text"
        className="input text-center"
        placeholder="Type word you want to Definition"
        value={word}
        autoFocus={true}
        onChange={(e) => {
          wordSet(e.target.value);
        }}
      />
    </div>
  );
};

export default PopupWordDefinitionsPopup;
