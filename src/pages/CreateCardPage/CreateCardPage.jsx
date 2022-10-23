import Breadcrumb from "@components/Breadcrumb";
import { CARD_LIST_PAGE } from "@pages/constant";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { run } from "../../functions/common";
import CreateQuestionAnswer from "./CreateQuestionAnswer";
import CreateQuestionAnswerExplain from "./CreateQuestionAnswerExplain";
const ChoiceType = ({ query, setQuery }) => (
  <>
    <Breadcrumb paths={[CARD_LIST_PAGE]} />
    <div className="mb-6 block-up bg-slate-800 rounded-md px-4 py-3 flex">
      <label
        htmlFor=""
        className="whitespace-nowrap text-xl text-slate-300 self-center mr-4"
      >
        Select type
      </label>
      <select
        name=""
        id=""
        value={query.get("type") || ""}
        className="input"
        onChange={(e) =>
          setQuery(
            run(() => {
              const cloneQuery = new URLSearchParams(query);
              cloneQuery.set("type", e.target.value);
              return cloneQuery;
            })
          )
        }
      >
        <option value="" disabled>
          select type
        </option>
        <option value="explain">card explain</option>
        <option value="noexplain">no card explain</option>
      </select>
    </div>
  </>
);
const CreateCardPage = () => {
  const [query, setQuery] = useSearchParams();

  switch (query.get("type")) {
    case "explain":
      return (
        <>
          <ChoiceType query={query} setQuery={setQuery} />
          <CreateQuestionAnswerExplain></CreateQuestionAnswerExplain>
        </>
      );
    case "noexplain":
      return (
        <>
          <ChoiceType query={query} setQuery={setQuery} />
          <CreateQuestionAnswer />
        </>
      );
    default:
      return <ChoiceType query={query} setQuery={setQuery} />;
  }
};

export default CreateCardPage;
