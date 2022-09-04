import clsx from "clsx";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import IconCircle from "../IconCircle";
import FastAdd from "./FastAdd";
const FastCreateOrSelectGroup = ({ value, onChange, className }) => {
  const groupCard = useSelector((s) => s.card.groupCard);
  const groupCardList = useMemo(
    () => groupCard.ids.map((id) => groupCard.entities[id]),
    [groupCard]
  );

  const [showMore, showMoreSet] = useState(false);
  return (
    <div className={clsx(className)}>
      <div className="flex">
        <label
          htmlFor=""
          className="whitespace-nowrap text-xl text-slate-300 self-center mr-4"
        >
          Select group:
        </label>
        <select className="input" value={value} onChange={onChange}>
          {!groupCardList.length > 0 && (
            <option value="" disabled>
              group doesn't found
            </option>
          )}

          {groupCardList.length > 0 && (
            <>
              <option value="" disabled>
                Select group for card
              </option>
              {groupCardList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </>
          )}
        </select>
        <button className="ml-4" onClick={() => showMoreSet(!showMore)}>
          <IconCircle
            size="md"
            className={clsx("fas fa-ellipsis-vertical transition-all", {
              "rotate-[-90deg]": showMore,
            })}
          />
        </button>
      </div>
      {showMore && (
        <FastAdd
          className="flex mt-4"
          onClose={() => {
            showMoreSet(false);
          }}
        />
      )}
    </div>
  );
};

export default FastCreateOrSelectGroup;
