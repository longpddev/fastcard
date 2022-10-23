import { KEY_NAME, SPECIAL_KEY } from "@/constants/index";
import { getTextSelect } from "@/functions/common";
import LoadingIcon from "@components/LoadingIcon";
import Popup from "@components/Popup/index";
import When from "@components/When";
import useShortcut from "@hooks/useShortcut";
import useWordDefinitions from "@hooks/useWordDefinitions";
import React from "react";
import { useRef } from "react";
import { useState } from "react";
import PopupWordDefinitionsContent from "./PopupWordDefinitionsContent";

const PopupWordDefinitionsPopup = ({ onClose }) => {
  const [word, wordSet] = useState("");
  const [typing, typingSet] = useState(true);
  let { data, isLoading, isNotfound } = useWordDefinitions(typing ? "" : word);

  useShortcut(SPECIAL_KEY.Ctrl + "s", (e) => {
    e.preventDefault();
    typingSet(true);
  });

  return (
    <Popup open={true} setOpen={onClose}>
      <When
        if={typing}
        component={PopupWordDefinitionsSearchBy}
        searchBy={(w) => {
          wordSet(w);
          typingSet(false);
        }}
      />
      <When if={!typing && isNotfound}>
        <div className="flex items-center justify-center h-24 w-full">
          <p>
            No Definitions Found
            <span className="text-2xl text-orange-400">&nbsp;{word}</span>.
            Please try again
          </p>
        </div>
      </When>
      <When if={!typing && !isNotfound && !data}>
        <div className="flex items-center justify-center h-24 w-full">
          <LoadingIcon className="text-2xl animate-spin text-sky-400"></LoadingIcon>
        </div>
      </When>
      <When if={!typing && !isNotfound && data}>
        {() => <PopupWordDefinitionsContent data={data[0]} />}
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
        onChange={(e) => wordSet(e.target.value)}
      />
    </div>
  );
};

export default PopupWordDefinitionsPopup;
