import React from "react";
import { Link } from "react-router-dom";
import { getMedia } from "../../api/client";
import { useGetVideoListQuery } from "../../services/queryApi";
import VideoTranscriptItem from "./VideoTranscriptItem";
import When from "../../components/When";
import { useNavigate } from "react-router-dom";
import HeaderPage from "@components/HeaderPage";
const VideoTranscriptList = () => {
  const navigate = useNavigate();
  const { isLoading, data, refetch } = useGetVideoListQuery({
    limit: 10,
    pageIndex: 1,
  });
  const listVideo = data?.data;
  const handleRequestRefresh = () => refetch();
  return (
    <div>
      <HeaderPage title={"Video transcript"}>
        <button
          onClick={() => navigate("/video/create")}
          className="button text-sky-400 ml-auto"
        >
          Create
        </button>
      </HeaderPage>
      <When if={listVideo && listVideo.rows.length > 0}>
        {() => (
          <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
            {listVideo.rows.map((item) => (
              <VideoTranscriptItem
                videoData={item}
                key={item.id}
                requestRefresh={handleRequestRefresh}
              />
            ))}
          </div>
        )}
      </When>
      <When if={listVideo && listVideo.rows.length === 0}>
        <h2 className="text-center text-4xl text-slate-600">Empty!</h2>
        <p className="text-center text-slate-500 text-xl mt-4">
          Can you add &nbsp;
          <Link className="underline" to={"/video/create"}>
            more
          </Link>
        </p>
      </When>
    </div>
  );
};

export default VideoTranscriptList;
