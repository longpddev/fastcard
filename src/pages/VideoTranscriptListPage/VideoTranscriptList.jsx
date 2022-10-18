import React from "react";
import { Link } from "react-router-dom";
import { getMedia } from "../../api/client";
import { useGetVideoListQuery } from "../../services/queryApi";

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

const VideoTranscriptItem = ({ videoData }) => {
  return (
    <div>
      <Link to={`/video/${videoData.id}`}>
        <div className="w-full">
          <div className="pt-[56.25%] relative">
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
    </div>
  );
};

export default VideoTranscriptList;
