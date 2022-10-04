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
    <div className={clsx(className, "flex flex-wrap")} {...props}>
      <textarea
        className="md:w-1/2 w-full input flex-1 min-w-[300px]"
        cols="30"
        rows="10"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      ></textarea>
      <Markdown className="md:w-1/2 w-full min-w-[300px] flex-1 block-down rounded-md p-2">
        {value || "Preview"}
      </Markdown>
    </div>
  );
};

export default EditorMarkdown;
