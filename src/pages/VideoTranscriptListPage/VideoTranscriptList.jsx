import React from "react";
import { Link } from "react-router-dom";
import { getMedia } from "../../api/client";
import { useGetVideoListQuery } from "../../services/queryApi";
import VideoTranscriptItem from "./VideoTranscriptItem";

const VideoTranscriptList = () => {
  const { isLoading, data } = useGetVideoListQuery({ limit: 10, pageIndex: 1 });
  const listVideo = data?.data;
  return (
    <div>
      <h1 className="text-4xl text-center mb-6">Video transcript</h1>
      <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        {listVideo &&
          listVideo.rows.map((item) => (
            <VideoTranscriptItem videoData={item} key={item.id} />
          ))}
      </div>
    </div>
  );
};

export default VideoTranscriptList;
