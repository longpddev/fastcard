import { firstCapitalize } from "@/functions/common";
import React from "react";
import FindImageByWords from "@components/FindImageByWords/index";

const TranslationContent = ({ data, originText }) => {
  return (
    <div className="p-4">
      <h2 className=" text-center text-sky-400 px-4 text-2xl font-medium">
        {firstCapitalize(originText)}
      </h2>
      <h3 className="text-slate-600 text-xl mb-4">
        Meaning: &nbsp;
        <span className="text-slate-300">
          {data.translations.reduce((acc, item) => {
            const text = firstCapitalize(item.translatedText);
            if (!acc) return text;
            return acc + ", " + text;
          }, "")}
        </span>
      </h3>
      <div className="max-h-[300px] overflow-auto" tabIndex={0}>
        <FindImageByWords words={originText} />
      </div>
    </div>
  );
};

export default TranslationContent;
