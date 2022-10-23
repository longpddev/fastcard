import { firstCapitalize } from "@/functions/common";
import React from "react";

const TranslationContent = ({ data, originText }) => {
  return (
    <div className="p-4">
      <h2 className=" text-center text-sky-400 px-4 text-2xl font-medium">
        {firstCapitalize(originText)}
      </h2>
      <h3 className="text-slate-600 text-xl">Meaning: </h3>
      <ul className="ml-4">
        {data.translations.map((item, i) => (
          <li key={i}>{firstCapitalize(item.translatedText)}</li>
        ))}
      </ul>
    </div>
  );
};

export default TranslationContent;
