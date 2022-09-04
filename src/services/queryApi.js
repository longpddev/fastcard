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
      query: (groupId) => `card${groupId ? `?groupId=${groupId}` : ""}`,
    }),
    getCardDetail: builder.query({
      query: (id) => `card/${id}`,
    }),
  }),
});

export const { useGetListCardQuery, useGetCardDetailQuery } = queryApi;
