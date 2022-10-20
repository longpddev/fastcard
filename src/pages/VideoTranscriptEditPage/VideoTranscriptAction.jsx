import React from "react";

const VideoTranscriptAction = ({
  handleSave,
  handleReset,
  isSaveable,
  children,
}) => {
  return (
    <div className="flex mt-6">
      <button
        className="button ml-auto text-green-400 disabled:opacity-50 disabled:pointer-events-none"
        disabled={!isSaveable}
        onClick={handleSave}
      >
        Save
      </button>
      <button className="button ml-4 text-gray-400" onClick={handleReset}>
        Reset
      </button>

      {children}
    </div>
  );
};

export default VideoTranscriptAction;
