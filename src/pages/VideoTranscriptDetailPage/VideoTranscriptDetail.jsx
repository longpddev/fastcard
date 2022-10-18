import React from "react";
import VideoPlayer from "../../components/VideoPlayer";
import { useParams } from "react-router-dom";
import { useGetVideoByIdQuery } from "../../services/queryApi";
import { getMedia } from "../../api/client";
const VideoTranscriptDetail = () => {
  const { videoId } = useParams();
  const { isLoading, data } = useGetVideoByIdQuery(videoId);
  const videoData = data?.data;
  return (
    <div>
      {videoData && (
        <VideoPlayer
          srcVideo={getMedia(videoData.path)}
          transcript={JSON.parse(videoData.transcript)}
        ></VideoPlayer>
      )}
    </div>
  );
};

export default VideoTranscriptDetail;
