import clsx from "clsx";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import Markdown from "./Markdown";

const EditorMarkdown = ({
  value,
  onChange,
  placeholder,
  className,
  ...props
}) => {
  return (
    <div className={clsx(className, "flex")} {...props}>
      <textarea
        className="md:w-1/2 w-full input"
        cols="30"
        rows="10"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
      <Markdown className="md:w-1/2 w-full block-down rounded-md p-2">
        {value || "Preview"}
      </Markdown>
    </div>
  );
};

export default EditorMarkdown;
