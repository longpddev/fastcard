import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.scss.css";
import ToastContainer from "./components/Toast/ToastContainer";
import { Provider } from "react-redux";
import { store } from "./store/app";
import ProgressGlobal from "./components/ProgressGlobal";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ProgressGlobal />
        <ToastContainer />
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
