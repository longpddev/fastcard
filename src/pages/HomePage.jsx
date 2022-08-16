import React from "react";
import Card from "../components/Card";
import CardLean from "../components/CardLean";
import { titlePage } from "../functions/common";

const HomePage = () => {
  titlePage("Home page");
  return <CardLean />;
};

export default HomePage;
