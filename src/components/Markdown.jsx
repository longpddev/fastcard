import clsx from "clsx";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
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
