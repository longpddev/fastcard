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
  IUserSettings,
} from '@/api/fast_card_client_api';
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { clientAuth, uploadfile } from '../../api/client';
import { CARD_TYPE } from '../../constants';
import { run } from '../../functions/common';
import { RootState } from 'store/app';
import { ICardGroupResponse } from '../../api/fast_card_client_api';
import { PromiseResult } from '@/interfaces/common';
import { updateAccountApi } from '../auth/authSlice';

export type ICardImageFile = {
  file: File;
  width: number;
  height: number;
};

export type ICardCreate = {
  fileImage: ICardImageFile;
  detail: string;
};

export interface ICreateCardApiParams {
  groupId: number;
  question: ICardCreate;
  answer: ICardCreate;
  explain?: ICardCreate;
}
export const createCardApi = async ({
  groupId,
  question,
  answer,
  explain,
}: ICreateCardApiParams) => {
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
};
export const createCardThunk = createAsyncThunk(
  'card/createCard',
  async ({ groupId, question, answer, explain }: ICreateCardApiParams) => {
    return await createCardApi({
      groupId,
      question,
      answer,
      explain,
    });
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

export interface IDeleteCardApi {
  id: number;
}
export const deleteCardApi = async ({ id }: IDeleteCardApi) => {
  return await clientAuth.DELETE<IEndPointCardDelete>(`/card/:id`, {
    paramsEndPoint: {
      id: id,
    },
  });
};
export const deleteCardThunk = createAsyncThunk(
  'card/deleteCard',
  async ({ id }: { id: number }) => {
    return await deleteCardApi({ id });
  },
);

export interface ICreateGroupCardApiParams {
  name: string;
}
export const createGroupCardApi = async ({
  name,
}: ICreateGroupCardApiParams) => {
  const result = await clientAuth.POST<IEndPointGroupCardCreate>(
    '/group-card',
    {
      body: {
        name: name,
      },
    },
  );

  return result;
};
export const createGroupCardThunk = createAsyncThunk(
  'card/createGroupCard',
  async ({ name }: ICreateGroupCardApiParams, { dispatch }) => {
    const result = await createGroupCardApi({ name });

    await dispatch(getGroupCardThunk());
    await dispatch(getCardLearnTodayThunk());

    return result;
  },
);

export interface IChangeGroupOfCardApiParams {
  id: number;
  groupId: number;
}
export const changeGroupOfCardApi = async ({
  id,
  groupId,
}: IChangeGroupOfCardApiParams) => {
  return await clientAuth.PUT<IEndPointCardChangeGroup>(
    `/card/:id/changeGroup`,
    {
      body: { groupId },
      paramsEndPoint: {
        id,
      },
    },
  );
};
export const changeGroupOfCardThunk = createAsyncThunk(
  'card/changeGroupOfCard',
  async ({ id, groupId }: IChangeGroupOfCardApiParams) => {
    return await changeGroupOfCardApi({ id, groupId });
  },
);

export interface IUpdateGroupCardApiParams {
  id: number;
  name: string;
}
export const updateGroupCardApi = async ({
  id,
  name,
}: IUpdateGroupCardApiParams) => {
  return await clientAuth.PUT<IEndPointGroupCardUpdate>(`/group-card/:id`, {
    body: {
      name: name,
    },
    paramsEndPoint: {
      id,
    },
  });
};
export const updateGroupCardThunk = createAsyncThunk(
  'card/updateGroupCard',
  async ({ id, name }: IUpdateGroupCardApiParams) => {
    await updateGroupCardApi({ id, name });

    return {
      id,
      name,
    };
  },
);

export interface IDeleteGroupCardApiParams {
  id: number;
}
export const deleteGroupCardApi = async ({ id }: IDeleteGroupCardApiParams) => {
  return await clientAuth.DELETE<IEndPointGroupCardDelete>(`/group-card/:id`, {
    paramsEndPoint: {
      id,
    },
  });
};
export const deleteGroupCardThunk = createAsyncThunk(
  'card/deleteGroupCard',
  async ({ id }: IDeleteGroupCardApiParams, { dispatch }) => {
    await deleteGroupCardApi({ id });
    await dispatch(getGroupCardThunk());
    return { id };
  },
);

export interface IUpdateCardStepApiParams {
  id: number;
  data: ICardStep;
}
export const updateCardStepApi = async ({
  id,
  data,
}: IUpdateCardStepApiParams) => {
  return await clientAuth.PUT<IEndPointCardStepUpdate>(`/card/step/:id`, {
    body: data,
    paramsEndPoint: {
      id,
    },
  });
};
export const updateCardStepThunk = createAsyncThunk(
  'card/updateCardStep',
  async ({ id, data }: IUpdateCardStepApiParams) => {
    return await updateCardStepApi({ id, data });
  },
);

type ICardLearnedTodayResponse = {
  groupId: number;
  card: {
    rows: Card[];
    count: number;
  };
};

export interface IGetCardLearnTodayByGroupIdApiParams {
  groupId: number;
  settings: IUserSettings;
}
export const getCardLearnTodayByGroupIdApi = async ({
  groupId,
  settings,
}: IGetCardLearnTodayByGroupIdApiParams) => {
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
};
export const getCardLearnTodayByGroupIdThunk = createAsyncThunk(
  'card/getCardLearnTodayByGroupId',
  async ({ groupId }: { groupId: number }, { getState }) => {
    const settings = (getState() as RootState).auth.settings;
    return await getCardLearnTodayByGroupIdApi({ groupId, settings });
  },
);

export const getCardLearnTodayThunk = createAsyncThunk(
  'card/getCardLearnToday',
  async (_, { getState, dispatch }) => {
    const groupCardIds = (getState() as RootState).card.groupCard.ids;
    await Promise.all(
      groupCardIds.map((id) =>
        dispatch(getCardLearnTodayByGroupIdThunk({ groupId: id })),
      ),
    );
  },
);

export const getGroupCardApi = async () => {
  return (await clientAuth.GET<IEndPointGroupCardGet>('/group-card', null))
    .data;
};

export const getGroupCardThunk = createAsyncThunk(
  'card/getGroupCard',
  async () => {
    return await getGroupCardApi();
  },
);

export interface IUpdateCardLearnedApiParams {
  cardId: number;
  isHard: boolean;
  groupId: number;
}
export const updateCardLearnedApi = async ({
  cardId,
  isHard,
}: IUpdateCardLearnedApiParams) => {
  return await clientAuth.POST<IEndPointCardLearnedUpdate>('/card/learned', {
    body: {
      cardId,
      isHard,
    },
  });
};
export const updateCardLearnedThunk = createAsyncThunk(
  'card/updateCardLearned',
  async ({ cardId, isHard, groupId }: IUpdateCardLearnedApiParams) => {
    await updateCardLearnedApi({ cardId, isHard, groupId });
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
    setGroupCard: (
      state,
      { payload }: PayloadAction<PromiseResult<typeof getGroupCardApi>>,
    ) => {
      state.groupCard.count = payload.count;
      state.groupCard.ids = payload.rows.map((item) => item.id);
      state.groupCard.entities = payload.rows.reduce(
        (acc, item) => (acc[item.id] = item) && acc,
        {} as Record<number, ICardGroupResponse>,
      );
    },
    setCardLearnTodayByGroupIdAction: (
      state,
      {
        payload,
      }: PayloadAction<PromiseResult<typeof getCardLearnTodayByGroupIdApi>>,
    ) => {
      if (state.learnToday.ids.indexOf(payload.groupId) === -1) {
        state.learnToday.ids = [...state.learnToday.ids, payload.groupId];
      }

      state.learnToday.entities = {
        ...state.learnToday.entities,
        [payload.groupId]: payload,
      };
    },
    updateGroupCardAction: (
      state,
      { payload }: PayloadAction<{ groupId: number; name: string }>,
    ) => {
      const { groupId, name } = payload;
      if (state.groupCard.entities[groupId]) {
        state.groupCard.entities[groupId].name = name;
      }
    },
    updateCardLearnedAction: (
      state,
      { payload }: PayloadAction<Omit<IUpdateCardLearnedApiParams, 'idHard'>>,
    ) => {
      const card = state.learnToday.entities[payload.groupId].card;

      card.rows = card.rows.filter((item) => item.id !== payload.cardId);

      state.process[payload.groupId] = Math.min(
        Math.max(card.rows.length - 1, 0),
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

export const groupCardSelector = createSelector(
  (state: RootState) => state.card.groupCard,
  (groupCard) => groupCard.ids.map((id) => groupCard.entities[id]),
);
export default cardSlice.reducer;
export const {
  initProcess,
  nextProcess,
  setGroupCard,
  setCardLearnTodayByGroupIdAction,
  updateGroupCardAction,
  updateCardLearnedAction,
} = cardSlice.actions;
