import React from "react";
import { Link } from "react-router-dom";
import FormAuth from "../components/FormAuth";

const SignUpPage = () => {
  return (
    <FormAuth title="Sign up">
      <input type="email" placeholder="Email" className="mb-4" />
      <input type="password" className="mb-4" placeholder="Password" />
      <input type="password" className="mb-6" placeholder="Confirm Password" />
      <button className="w-full text-green-500 button">Create</button>
      <p className="text-center pt-4">
        or, <Link to="/login">log in</Link>
      </p>
    </FormAuth>
  );
};

export default SignUpPage;
