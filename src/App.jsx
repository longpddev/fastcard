import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import CreateCardPage from "./pages/CreateCardPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Default from "./layouts/Default";
import Blank from "./layouts/Blank";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HasLogin from "./components/Auth/HasLogin";
import CardListPage from "./pages/CardListPage/CardListPage";
import CardDetailPage from "./pages/CardDetailPage/CardDetailPage";
import LearningPage from "./pages/LearningPage";
import AccountPage from "./pages/AccountPage";
import VideoTranscriptDetailPage from "./pages/VideoTranscriptDetailPage";
import VideoTranscriptCreatePage from "./pages/VideoTranscriptCreatePage";
import VideoTranscriptListPage from "./pages/VideoTranscriptListPage";
function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <HasLogin>
              <Default>
                <HomePage />
              </Default>
            </HasLogin>
          }
        />
        <Route
          path="/create-card"
          element={
            <HasLogin>
              <Default>
                <CreateCardPage />
              </Default>
            </HasLogin>
          }
        />

        <Route
          path="/list-card"
          element={
            <HasLogin>
              <Default>
                <CardListPage />
              </Default>
            </HasLogin>
          }
        />

        <Route
          path="/card-detail/:id"
          element={
            <HasLogin>
              <Default>
                <CardDetailPage />
              </Default>
            </HasLogin>
          }
        />

        <Route
          path="/learn/:groupId"
          element={
            <HasLogin>
              <Default>
                <LearningPage />
              </Default>
            </HasLogin>
          }
        />
        <Route
          path="/video/create"
          element={
            <HasLogin>
              <Default>
                <VideoTranscriptCreatePage />
              </Default>
            </HasLogin>
          }
        />
        <Route
          path="/video"
          element={
            <HasLogin>
              <Default>
                <VideoTranscriptListPage />
              </Default>
            </HasLogin>
          }
        />
        <Route
          path="/video/:videoId"
          element={
            <HasLogin>
              <Default>
                <VideoTranscriptDetailPage />
              </Default>
            </HasLogin>
          }
        />

        <Route
          path="/account"
          element={
            <HasLogin>
              <Default>
                <AccountPage />
              </Default>
            </HasLogin>
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
