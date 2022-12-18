'use client';

import {
  IEndPointVideoDelete,
  IEndPointVideoGet,
  IEndPointVideoInitUploadProcess,
  IEndPointVideoMergePartFiles,
  IEndPointVideoUpdateData,
  IEndPointVideoUpdateFile,
  IEndPointVideoUploadFinally,
  IEndPointVideoUploadPartFile,
  IVideoFieldUpdatable,
} from '@/api/fast_card_client_api';
import { sliceFile } from '@/functions/common';
import { PromiseResult } from '@/interfaces/common';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { clientAuth, uploadfile } from '../../api/client';

export interface ICreateVideoTranscriptApiParams {
  file: File;
  name: string;
  title: string;
  description: string;
  thumbnailId: number;
  width: number;
  height: number;
  metadata: Record<string, string | number>;
  transcript: string;
  onProgressUpload: (a: number, b: number) => void;
}

export const createVideoTranscriptApi = async ({
  file,
  name,
  title,
  description,
  thumbnailId,
  width,
  height,
  transcript,
  onProgressUpload,
}: ICreateVideoTranscriptApiParams) => {
  let result = [];
  const sliceFiles = sliceFile(file);
  const progress = sliceFiles.map((f) => ({ loaded: 0, total: f.size }));
  let prevTime = new Date().getTime();
  const handleProgressUpload = () => {
    if (!onProgressUpload) return;
    const currentTime = new Date().getTime();
    if (currentTime <= prevTime + 1000) {
      return;
    }
    prevTime = currentTime;

    onProgressUpload(
      progress.reduce((acc, i) => (acc += i.loaded), 0),
      progress.reduce((acc, i) => (acc += i.total), 0),
    );
  };
  const {
    data: { tokenUpload },
  } = await clientAuth.GET<IEndPointVideoInitUploadProcess>(
    '/video/upload-multiple/init',
    null,
  );
  result = await Promise.all(
    sliceFiles.map((f, index) =>
      uploadfile<IEndPointVideoUploadPartFile>(
        '/video/upload-multiple/file',
        {
          file: f,
          index,
          size: f.size,
          totalFile: sliceFiles.length,
          tokenUpload,
        },
        undefined,
        'POST',
        {
          onProgressUpload: function (loaded: number, total: number) {
            progress[index].loaded = loaded;
            progress[index].total = total;
            handleProgressUpload();
          },
        },
      ),
    ),
  );

  const resultMerge = await clientAuth.POST<IEndPointVideoMergePartFiles>(
    '/video/upload-multiple/merge',
    {
      body: {
        tokenUpload,
      },
    },
  );
  const resultFinally = await clientAuth.POST<IEndPointVideoUploadFinally>(
    '/video/upload',
    {
      body: {
        data: {
          title,
          name,
          description,
          thumbnailId,
          width,
          height,
          metadata: '',
          transcript,
        },
        tokenUpload,
        extension: 'mp4',
      },
    },
  );
  return resultFinally;
};

export const createVideoTranscriptThunk = createAsyncThunk(
  'videoTranscript/createVideoTranscriptThunk',
  async ({
    file,
    name,
    title,
    description,
    thumbnailId,
    width,
    height,
    metadata,
    transcript,
    onProgressUpload,
  }: ICreateVideoTranscriptApiParams) => {
    return await createVideoTranscriptApi({
      file,
      name,
      title,
      description,
      thumbnailId,
      width,
      metadata,
      height,
      transcript,
      onProgressUpload,
    });
  },
);

export type IGetVideoTranscriptByIdApiParams = number;
export const getVideoTranscriptByIdApi = async (
  id: IGetVideoTranscriptByIdApiParams,
) => {
  const result = await clientAuth.GET<IEndPointVideoGet>(`/video/:id`, {
    paramsEndPoint: {
      id,
    },
  });
  return result.data;
};
export const getVideoTranscriptByIdThunk = createAsyncThunk(
  'videoTranscript/getVideoTranscriptById',
  async (id: IGetVideoTranscriptByIdApiParams) => {
    return await getVideoTranscriptByIdApi(id);
  },
);

export interface IUpdateVideoDataApiParams {
  id: number;
  field: Partial<IVideoFieldUpdatable>;
}
export const updateVideoDataApi = async ({
  field,
  id,
}: IUpdateVideoDataApiParams) => {
  const result = await clientAuth.PUT<IEndPointVideoUpdateData>(`/video/:id`, {
    body: field,
    paramsEndPoint: {
      id,
    },
  });

  return result.data;
};
export const updateVideoDataThunk = createAsyncThunk(
  'videoTranscript/updateVideoData',
  async ({ field, id }: IUpdateVideoDataApiParams) => {
    return await updateVideoDataApi({ field, id });
  },
);

export interface IUpdateVideoTranscriptionSourceApiParams {
  id: number;
  file: File;
  width: number;
  height: number;
  onProgressUpload: (a: number, b: number) => void;
}
export const updateVideoTranscriptionSourceApi = async ({
  id,
  file,
  width,
  height,
  onProgressUpload,
}: IUpdateVideoTranscriptionSourceApiParams) => {
  return await uploadfile<IEndPointVideoUpdateFile>(
    `/video/:id/change-video`,
    {
      file,
      width,
      height,
    },
    {
      id,
    },
    'PUT',
    {
      onProgressUpload,
    },
  );
};
export const updateVideoTranscriptionSourceThunk = createAsyncThunk(
  'videoTranscript/updateVideoTranscriptionSource',
  async ({
    id,
    file,
    width,
    height,
    onProgressUpload,
  }: IUpdateVideoTranscriptionSourceApiParams) => {
    return updateVideoTranscriptionSourceApi({
      id,
      file,
      width,
      height,
      onProgressUpload,
    });
  },
);

export type IDeleteVideoTranscriptApiParams = number;
export const deleteVideoTranscriptApi = async (
  id: IDeleteVideoTranscriptApiParams,
) => {
  return await clientAuth.DELETE<IEndPointVideoDelete>(`/video/:id`, {
    paramsEndPoint: {
      id,
    },
  });
};
export const deleteVideoTranscriptThunk = createAsyncThunk(
  'videoTranscript/deleteVideoTranscript',
  async (id: number) => {
    return await deleteVideoTranscriptApi(id);
  },
);

const videoTranscriptSlice = createSlice({
  name: 'videoTranscript',
  initialState: {
    metadata: {
      progressIndex: 0,
    },
  },
  reducers: {
    setCurrentProcess: (state, { payload }) => {
      state.metadata.progressIndex = payload;
    },

    setVideoTranscriptByIdAction: (
      state,
      {
        payload,
      }: PayloadAction<PromiseResult<typeof getVideoTranscriptByIdApi>>,
    ) => {
      state.metadata.progressIndex = payload.metadata?.progressIndex || 0;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(
      getVideoTranscriptByIdThunk.fulfilled,
      (state, { payload }) => {
        state.metadata.progressIndex = payload.metadata?.progressIndex || 0;
      },
    ),
});

export default videoTranscriptSlice.reducer;

export const { setCurrentProcess, setVideoTranscriptByIdAction } = videoTranscriptSlice.actions;
