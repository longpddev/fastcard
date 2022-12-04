'use client';

import {
  Card,
  ICardStep,
  IEndPointCardChangeGroup,
  IEndPointCardCreate,
  IEndPointCardDelete,
  IEndPointCardLearnedUpdate,
  IEndPointCardLearnToday,
  IEndPointCardNoExplainCreate,
  IEndPointCardStepUpdate,
  IEndPointGroupCardCreate,
  IEndPointGroupCardDelete,
  IEndPointGroupCardGet,
  IEndPointGroupCardUpdate,
  IEndPointImageUpdate,
  IEndPointImageUpload,
} from '@/api/fast_card_client_api';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { clientAuth, uploadfile } from '../../api/client';
import { CARD_TYPE } from '../../constants';
import { run } from '../../functions/common';
import { RootState } from 'store/app';
import { ICardGroupResponse } from '../../api/fast_card_client_api';

export type ICardImageFile = {
  file: File;
  width: number;
  height: number;
};

export type ICardCreate = {
  fileImage: ICardImageFile;
  detail: string;
};
export const createCardThunk = createAsyncThunk(
  'card/createCard',
  async ({
    groupId,
    question,
    answer,
    explain,
  }: {
    groupId: number;
    question: ICardCreate;
    answer: ICardCreate;
    explain?: ICardCreate;
  }) => {
    const [questionImage, answerImage, explainImage] = await Promise.all(
      run(() => {
        const result = [
          uploadImageAndGetData(question.fileImage),
          uploadImageAndGetData(answer.fileImage),
        ];
        explain && result.push(uploadImageAndGetData(explain.fileImage));
        return result;
      }),
    );

    if (!explain) {
      const bodyCardNoExplain = {
        info: {
          cardGroupId: groupId,
        },
        cardQuestion: {
          imageId: questionImage ? questionImage.id : null,
          content: question.detail,
          type: CARD_TYPE.question,
          cardGroupId: groupId,
        },
        cardAnswer: {
          imageId: answerImage ? answerImage.id : null,
          content: answer.detail,
          type: CARD_TYPE.answer,
          cardGroupId: groupId,
        },
      };
      const result = await clientAuth.POST<IEndPointCardNoExplainCreate>(
        '/card/noexplain',
        {
          body: bodyCardNoExplain,
        },
      );

      return result;
    } else {
      const bodyCard = {
        info: {
          cardGroupId: groupId,
        },
        cardQuestion: {
          imageId: questionImage ? questionImage.id : null,
          content: question.detail,
          type: CARD_TYPE.question,
          cardGroupId: groupId,
        },
        cardAnswer: {
          imageId: answerImage ? answerImage.id : null,
          content: answer.detail,
          type: CARD_TYPE.answer,
          cardGroupId: groupId,
        },
        cardExplain: {
          imageId: explainImage ? explainImage.id : null,
          content: explain.detail,
          type: CARD_TYPE.explain,
          cardGroupId: groupId,
        },
      };
      const result = await clientAuth.POST<IEndPointCardCreate>('/card', {
        body: bodyCard,
      });

      return result;
    }
  },
);

export const uploadImageAndGetData = async (file: ICardImageFile) => {
  if (!file) return file;
  const result = await uploadfile<IEndPointImageUpload>(
    '/image/upload',
    file,
    undefined,
  );
  return result.data;
};

export const updateImageAndGetData = async (
  id: number,
  file: ICardImageFile,
) => {
  const result = await uploadfile<IEndPointImageUpdate>(`/image/:id`, file, {
    id,
  });
  return result.data;
};

export const deleteCardThunk = createAsyncThunk(
  'card/deleteCard',
  async ({ id }: { id: number }) => {
    return await clientAuth.DELETE<IEndPointCardDelete>(`/card/:id`, {
      paramsEndPoint: {
        id: id,
      },
    });
  },
);

export const createGroupCardThunk = createAsyncThunk(
  'card/createGroupCard',
  async ({ name }: { name: string }, { dispatch }) => {
    const result = await clientAuth.POST<IEndPointGroupCardCreate>(
      '/group-card',
      {
        body: {
          name: name,
        },
      },
    );

    await dispatch(getGroupCardThunk());
    await dispatch(getCardLearnTodayThunk());

    return result;
  },
);

export const changeGroupOfCardThunk = createAsyncThunk(
  'card/changeGroupOfCard',
  async ({ id, groupId }: { id: number; groupId: number }) => {
    return await clientAuth.PUT<IEndPointCardChangeGroup>(
      `/card/:id/changeGroup`,
      {
        body: { groupId },
        paramsEndPoint: {
          id,
        },
      },
    );
  },
);

export const updateGroupCardThunk = createAsyncThunk(
  'card/updateGroupCard',
  async ({ id, name }: { id: number; name: string }) => {
    await clientAuth.PUT<IEndPointGroupCardUpdate>(`/group-card/:id`, {
      body: {
        name: name,
      },
      paramsEndPoint: {
        id,
      },
    });

    return {
      id,
      name,
    };
  },
);

export const deleteGroupCardThunk = createAsyncThunk(
  'card/deleteGroupCard',
  async ({ id }: { id: number }, { dispatch }) => {
    await clientAuth.DELETE<IEndPointGroupCardDelete>(`/group-card/:id`, {
      paramsEndPoint: {
        id,
      },
    });
    await dispatch(getGroupCardThunk());
    return { id };
  },
);

export const updateCardStepThunk = createAsyncThunk(
  'card/updateCardStep',
  async ({ id, data }: { id: number; data: ICardStep }) => {
    return await clientAuth.PUT<IEndPointCardStepUpdate>(`/card/step/:id`, {
      body: data,
      paramsEndPoint: {
        id,
      },
    });
  },
);

type ICardLearnedTodayResponse = {
  groupId: number;
  card: {
    rows: Card[];
    count: number;
  };
};
export const getCardLearnTodayByGroupIdThunk = createAsyncThunk(
  'card/getCardLearnTodayByGroupId',
  async ({ groupId }: { groupId: number }, { getState }) => {
    const settings = (getState() as RootState).auth.settings;
    if (Object.keys(settings).length === 0)
      throw new Error("Setting user doesn't load yet");
    const card = await clientAuth.GET<IEndPointCardLearnToday>(
      '/card/learn-today',
      {
        params: {
          limit: settings.maxCardInDay,
          groupId,
        },
      },
    );

    const result: ICardLearnedTodayResponse = {
      groupId,
      card: {
        rows: card.data.rows?.sort(() => {
          const ram = Math.random();
          if (ram === 0.5) return 0;
          return ram > 0.5 ? 1 : -1;
        }),
        count: card.data.count,
      },
    };

    return result;
  },
);

export const getCardLearnTodayThunk = createAsyncThunk(
  'card/getCardLearnToday',
  async (_, { getState, dispatch }) => {
    (getState() as RootState).card.groupCard.ids.forEach((item) => {
      dispatch(getCardLearnTodayByGroupIdThunk({ groupId: item }));
    });
  },
);

export const getGroupCardThunk = createAsyncThunk(
  'card/getGroupCard',
  async () => {
    return (await clientAuth.GET<IEndPointGroupCardGet>('/group-card', null))
      .data;
  },
);

export const updateCardLearnedThunk = createAsyncThunk(
  'card/updateCardLearned',
  async ({
    cardId,
    isHard,
    groupId,
  }: {
    cardId: number;
    isHard: boolean;
    groupId: number;
  }) => {
    await clientAuth.POST<IEndPointCardLearnedUpdate>('/card/learned', {
      body: {
        cardId,
        isHard,
      },
    });
    return {
      cardId,
      groupId,
    };
  },
);

type IProcessCard = Record<number, number>;
const initialState = () => {
  const process: IProcessCard = {};
  const learnToday: {
    ids: Array<number>;
    entities: Record<number, ICardLearnedTodayResponse>;
  } = {
    ids: [],
    entities: {},
  };
  const groupCard: {
    count: number;
    ids: Array<number>;
    entities: Record<number, ICardGroupResponse>;
  } = {
    count: 0,
    ids: [],
    entities: {},
  };
  return {
    process,
    learnToday,
    groupCard,
  };
};

export const cardSlice = createSlice({
  name: 'card',
  initialState: initialState(),
  reducers: {
    initProcess: (state, { payload }: { payload: { groupId: number } }) => {
      state.process[payload.groupId] = 0;
    },
    nextProcess: (state, { payload }: { payload: { groupId: number } }) => {
      const max =
        state.learnToday.entities[payload.groupId].card.rows.length - 1;
      state.process[payload.groupId] += 1;

      state.process[payload.groupId] = Math.min(
        Math.max(max, 0),
        state.process[payload.groupId],
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGroupCardThunk.fulfilled, (state, { payload }) => {
        state.groupCard.count = payload.count;
        state.groupCard.ids = payload.rows.map((item) => item.id);
        state.groupCard.entities = payload.rows.reduce(
          (acc, item) => (acc[item.id] = item) && acc,
          {} as Record<number, ICardGroupResponse>,
        );
      })
      .addCase(
        getCardLearnTodayByGroupIdThunk.fulfilled,
        (state, { payload }) => {
          if (state.learnToday.ids.indexOf(payload.groupId) === -1) {
            state.learnToday.ids = [...state.learnToday.ids, payload.groupId];
          }

          state.learnToday.entities = {
            ...state.learnToday.entities,
            [payload.groupId]: payload,
          };
        },
      )
      .addCase(updateGroupCardThunk.fulfilled, (state, { payload }) => {
        const { id, name } = payload;
        if (state.groupCard.entities[id]) {
          state.groupCard.entities[id].name = name;
        }
      })
      .addCase(updateCardLearnedThunk.fulfilled, (state, { payload }) => {
        const card = state.learnToday.entities[payload.groupId].card;

        card.rows = card.rows.filter((item) => item.id !== payload.cardId);

        state.process[payload.groupId] = Math.min(
          Math.max(card.rows.length - 1, 0),
          state.process[payload.groupId],
        );
      });
  },
});

export const selectorGroupNameExist = createSelector(
  (state: RootState) => state.card.groupCard.entities,
  (entities) => (groupName: string) =>
    Object.values(entities).some(
      (group) => group.name.toLowerCase() === groupName.toLowerCase(),
    ),
);
export default cardSlice.reducer;
export const { initProcess, nextProcess } = cardSlice.actions;
