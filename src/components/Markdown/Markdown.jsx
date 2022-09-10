import clsx from "clsx";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const Markdown = ({ children, className = "", ...props }) => (
  <ReactMarkdown
    className={clsx(className, "markdown")}
    style={{ whileSpace: "pre-wrap" }}
    {...props}
    remarkPlugins={[remarkGfm]}
  >
    {children}
  </ReactMarkdown>
);

export default Markdown;
