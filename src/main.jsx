import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.scss.css";
import { Provider } from "react-redux";
import { store } from "@/store/app";
import ProgressGlobal from "@components/ProgressGlobal";
import PopupWordDefinitions from "@components/PopupWordDefinitions";
import Translation from "@components/Translation";
import NavigateSite from "@components/NavigateSite/index";
import SearchSite from "@components/SearchSite/index";
const ToastContainer = React.lazy(() =>
  import("@components/Toast/ToastContainer")
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ProgressGlobal />
        <Suspense fallback={null}>
          <ToastContainer />
        </Suspense>
        <PopupWordDefinitions />
        <Translation />
        <NavigateSite />
        <SearchSite />
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
