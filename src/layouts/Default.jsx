import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import wrapperLayout from "../functions/wrapperLayout";

const Default = ({ children }) => {
  return (
    <>
      <Header />
      <main className="c-container pb-10 relative">{children}</main>
      <Footer />
    </>
  );
};

export default Default;
