import React from "react";
import { Link } from "react-router-dom";
import { getMedia } from "../../api/client";
import VideoTranscriptMoreFeature from "./VideoTranscriptMoreFeature";

const VideoTranscriptItem = ({ videoData }) => {
  return (
    <div className="relative group">
      <Link to={`/video/${videoData.id}`}>
        <div className="w-full">
          <div className="pt-[56.25%] relative ">
            <div
              className="absolute inset-0 w-full h-full z-[-1]"
              style={{
                background: `url("${getMedia(
                  videoData.thumbnail.path
                )}") no-repeat center`,
                filter: "blur(20px)",
              }}
            ></div>
            <div className="absolute inset-0 w-full h-full flex justify-center">
              <img
                src={getMedia(videoData.thumbnail.path)}
                alt=""
                className="block"
              />
            </div>
          </div>
        </div>
        <h3 className="mt-4">{videoData.title}</h3>
      </Link>
      <VideoTranscriptMoreFeature
        id={videoData.id}
        className="group-hover:opacity-100 opacity-0 absolute top-2 right-2"
      />
    </div>
  );
};

export default VideoTranscriptItem;
