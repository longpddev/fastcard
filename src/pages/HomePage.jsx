import { path } from "ramda";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { maybe, titlePage } from "../functions/common";
import { getCardLearnTodayThunk } from "../services/card/cardSlice";

const HomePage = () => {
  titlePage("Home page");
  const dispatch = useDispatch();
  const groupCardEntities = useSelector((s) => s.card.groupCard.entities);
  const learnToday = maybe(useSelector((s) => s.card.learnToday))
    .map((item) => item.ids.map((key) => item.entities[key]))
    .get();
  useEffect(() => {
    // auto update list learn
    const timer = setInterval(
      () => dispatch(getCardLearnTodayThunk()),
      1000 * 60
    );

    return () => clearInterval(timer);
  }, []);
  return (
    <div>
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
          {learnToday.map((item) => (
            <tr key={item.groupId}>
              <td className="">
                <Link to={`/learn/${item.groupId}`}>
                  {path([item.groupId, "name"], groupCardEntities)}
                </Link>
              </td>
              <td className="text-center ">
                <span className="text-green-400">{item.card.rows.length}</span>
                &nbsp;
                <span className="text-gray-400">in</span>&nbsp;
                <span className="text-sky-400">{item.card.count}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomePage;
