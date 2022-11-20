import { SHORTCUT_ACCEPT, SHORTCUT_TOGGLE_TRANSLATE } from "@/constants/index";
import Popup from "@components/Popup";
import React from "react";
import When from "@components/When";
import useRapitGoogleTranslate from "@hooks/useRapitGoogleTranslate";
import LoadingIcon from "@components/LoadingIcon";
import TranslationContent from "./TranslationContent";
import { useState } from "react";
import useShortcut from "@hooks/useShortcut";
import { matchShortCut } from "@/functions/common";

const TranslationPopup = ({ onClose }) => {
  const [typing, typingSet] = useState(true);
  const [textTranslate, textTranslateSet] = useState("");
  const { data, error, isLoading } = useRapitGoogleTranslate(textTranslate);

  useShortcut(SHORTCUT_TOGGLE_TRANSLATE, () => typingSet(true));

  // toggle popup open and close using one shortcut
  useShortcut(SHORTCUT_TOGGLE_TRANSLATE, () => typing && onClose());

  return (
    <Popup open={true} setOpen={onClose}>
      <When
        if={typing}
        component={TranslationInput}
        setText={(text) => {
          typingSet(false);
          textTranslateSet(text);
        }}
      />
      <When if={!typing && error}>
        <div className="w-full relative h-20 flex items-center justify-center">
          <p className="text-xl text-red-400">Translate fail.</p>
        </div>
      </When>
      <When if={!typing && isLoading}>
        <div className="w-full relative h-20 flex items-center justify-center">
          <LoadingIcon className="text-2xl animate-spin"></LoadingIcon>
        </div>
      </When>
      <When if={!typing && data}>
        {() => (
          <TranslationContent
            data={data}
            originText={textTranslate}
          ></TranslationContent>
        )}
      </When>
    </Popup>
  );
};

const TranslationInput = ({ setText }) => {
  const [value, valueSet] = useState("");

  return (
    <div className="p-4">
      <h2 className="text-center font-semibold text-2xl mb-4">Translate</h2>
      <input
        type="text"
        className="text-center input"
        autoFocus={true}
        onKeyDown={(e) => {
          if (matchShortCut(e, SHORTCUT_ACCEPT) && value.trim().length > 0)
            setText && setText(value);
        }}
        placeholder="Type what you want to translate"
        value={value}
        onChange={(e) => valueSet(e.target.value)}
      />
    </div>
  );
};

export default TranslationPopup;
