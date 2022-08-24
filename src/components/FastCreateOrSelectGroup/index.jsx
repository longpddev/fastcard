import clsx from "clsx";
import React, { useState } from "react";
import { useGetGroupCardQuery } from "../../services/queryApi";
import IconCircle from "../IconCircle";
import FastAdd from "./FastAdd";
const FastCreateOrSelectGroup = ({ value, onChange }) => {
  const { data, isLoading, refetch } = useGetGroupCardQuery();
  const [showMore, showMoreSet] = useState(false);
  return (
    <div>
      <div className="flex">
        <select className="input" name="" id="">
          {isLoading && (
            <option value="" selected disabled>
              Loading
            </option>
          )}

          {!isLoading && data.data.length === 0 && (
            <option value="" selected disabled>
              group doesn't found
            </option>
          )}

          {!isLoading &&
            data.data.map((item) => (
              <option value={item.id}>{item.name}</option>
            ))}
        </select>
        <button className="ml-4" onClick={() => showMoreSet(!showMore)}>
          <IconCircle
            size="md"
            className={clsx("fas fa-angle-left transition-all", {
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
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default FastCreateOrSelectGroup;
