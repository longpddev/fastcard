import React, { Suspense } from "react";
import LoadingIcon from "../LoadingIcon";
const Lazy = React.lazy(() => import("./Markdown"));
const MarkdownLazyLoad = (props) => {
  const Loading = (
    <div className="flex justify-center w-full">
      <LoadingIcon></LoadingIcon>
    </div>
  );
  return (
    <Suspense fallback={Loading}>
      <Lazy {...props} />
    </Suspense>
  );
};

export default MarkdownLazyLoad;
