import React from "react";
import { Link } from "react-router-dom";
import FormAuth from "../components/FormAuth";

const LoginPage = () => {
  return (
    <FormAuth title="Log in">
      <input type="email" placeholder="Email" className="mb-4" />
      <input type="password" className="mb-6" placeholder="Password" />
      <button className="w-full text-green-500 button">Submit</button>
      <p className="text-center pt-6">
        or, <Link to="/sign-up">sign up</Link>
      </p>
    </FormAuth>
  );
};

export default LoginPage;
