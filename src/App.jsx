import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import CreateCardPage from "./pages/CreateCardPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Default from "./layouts/Default";
import Blank from "./layouts/Blank";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Default>
              <HomePage />
            </Default>
          }
        />
        <Route
          path="/create-card"
          element={
            <Default>
              <CreateCardPage />
            </Default>
          }
        />
        <Route
          path="/learn"
          element={
            <Default>
              <h1>learn</h1>
            </Default>
          }
        />

        <Route
          path="/login"
          element={
            <Blank>
              <LoginPage></LoginPage>
            </Blank>
          }
        />

        <Route
          path="/sign-up"
          element={
            <Blank>
              <SignUpPage></SignUpPage>
            </Blank>
          }
        />
        <Route
          path="*"
          element={
            <Default>
              <NotFound />
            </Default>
          }
        />
      </Routes>
    </>
  );
}

export default App;
