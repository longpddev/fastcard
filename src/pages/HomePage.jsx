import { path } from "ramda";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { maybe, titlePage } from "../functions/common";
import { getCardLearnTodayThunk } from "../services/card/cardSlice";

const HomePage = () => {
  titlePage("Home page");
  const dispatch = useDispatch();
  const groupCard = useSelector((s) => s.card.groupCard);

  useEffect(() => {
    // auto update list
    const timer = setInterval(
      () => dispatch(getCardLearnTodayThunk()),
      1000 * 60
    );

    return () => clearInterval(timer);
  }, []);
  return (
    <div className="mt-10">
      <h1 className="text-center text-2xl md:text-4xl md:mb-10 md-6">
        Welcome back!
      </h1>
      <table className="w-full table-border-full">
        <thead>
          <tr>
            <th className="text-start text-xl">Group name</th>
            <th className="text-xl">Learn</th>
          </tr>
        </thead>
        <tbody>
          {groupCard.ids.map((id) => (
            <GroupRow
              groupId={id}
              key={id}
              name={path([id, "name"], groupCard.entities)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const GroupRow = ({ groupId, name }) => {
  const result = useSelector((s) => s.card.learnToday.entities[groupId]);

  return (
    <tr>
      <td className="">
        <Link to={`/learn/${groupId}`}>{name}</Link>
      </td>
      <td className="text-center ">
        {result ? (
          <>
            <span className="text-green-400">{result.card.rows.length}</span>
            &nbsp;
            <span className="text-gray-400">in</span>&nbsp;
            <span className="text-sky-400">{result.card.count}</span>
          </>
        ) : null}
      </td>
    </tr>
  );
};

export default HomePage;
