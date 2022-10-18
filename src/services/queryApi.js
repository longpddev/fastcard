import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../api/client";
import { token } from "../functions/common";

export const queryApi = createApi({
  reducerPath: "queryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) headers.set("authorization", `Bearer ${token}`);

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getListCard: builder.query({
      query: ({ groupId, limit = 10, pageIndex = 1 }) =>
        `card${
          groupId
            ? `?groupId=${groupId}&limit=${limit}&pageIndex=${pageIndex}`
            : ""
        }`,
    }),
    getCardDetail: builder.query({
      query: (id) => `card/${id}`,
    }),
    getVideoList: builder.query({
      query: ({ limit = 10, pageIndex = 1 }) =>
        `video?limit=${limit}&pageIndex=${pageIndex}`,
    }),
    getVideoById: builder.query({
      query: (id) => `video/${id}`,
    }),
  }),
});

export const {
  useGetListCardQuery,
  useGetCardDetailQuery,
  useGetVideoListQuery,
  useGetVideoByIdQuery,
} = queryApi;
