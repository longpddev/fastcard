'use client';

import { capitalize, getFileImageField } from '@/functions/common';
import { createCardApi } from '@/services/card/cardSlice';
import EditorMarkdown from '@/ui/EditorMarkdown';
import FastCreateOrSelectGroup from '@/ui/FastCreateOrSelectGroup';
import FileUpLoad from '@/ui/FileUpLoad';
import PageTab from '@/ui/PageTab';
import { progressWatchPromise } from '@/ui/ProgressGlobal';
import { pushToast } from '@/ui/Toast';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { creatorFormData } from './utils';

const CARD_TYPE = {
  card_group: 'card_group',
  question: 'question',
  answer: 'answer',
} as const;

const useFormData = creatorFormData(CARD_TYPE);

const CreateQuestionAnswer = () => {
  const dispatch = useDispatch();
  const { getData, setData, reset } = useFormData();
  const [groupId, groupIdSet] = useState('');
  const controlRef = useRef<any>();
  const validGroup = () => {
    const result = Boolean(groupId);
    if (!result) pushToast.warning('Please chose group card');
    return result;
  };
  const checkValid = (tabKey: string) => {
    const validCardContent = (type: string) => {
      if (!getData(type as keyof typeof CARD_TYPE, 'detail')) {
        pushToast.warning(
          `Field detail of ${capitalize(tabKey)} card is require`,
        );
        return false;
      }

      return true;
    };

    const caseOb = {
      [CARD_TYPE.card_group]: () => validGroup(),
      [CARD_TYPE.question]: () => validCardContent(CARD_TYPE.question),
      [CARD_TYPE.answer]: () => validCardContent(CARD_TYPE.answer),
    };

    return caseOb[tabKey as keyof typeof caseOb]();
  };
  const gotoTop = () => window.scrollTo({ top: 0, left: 0 });
  const handleNext = () => {
    gotoTop();
    return true;
  };

  return (
    <>
      <div className="block-up mb-6 rounded-md bg-slate-800 px-4 py-3">
        <FastCreateOrSelectGroup
          value={groupId}
          onChange={(e) => {
            groupIdSet(e.target.value);
          }}
        />
      </div>
      <PageTab
        defaultActive={CARD_TYPE.question}
        typeStep={true}
        onNext={handleNext}
        beforeNext={checkValid}
        controlRef={controlRef}
        onSubmit={() => {
          if (!validGroup()) return;
          createCardApi({
            groupId: parseInt(groupId),
            question: {
              fileImage: getFileImageField(
                getData(CARD_TYPE.question, 'fileImage'),
              ),
              detail: getData(CARD_TYPE.question, 'detail'),
            },
            answer: {
              fileImage: getFileImageField(
                getData(CARD_TYPE.answer, 'fileImage'),
              ),
              detail: getData(CARD_TYPE.answer, 'detail'),
            },
          })
            .then(() => {
              reset();
              gotoTop();
              controlRef.current && controlRef.current.reset();
              pushToast.success('Create card success');
            })
            .catch(() => {
              pushToast.error('Sometime error please try again!');
            })
            .finally(progressWatchPromise());
        }}
      >
        <PageTab.Title tabKey={CARD_TYPE.question}>Question card</PageTab.Title>
        <PageTab.Title tabKey={CARD_TYPE.answer}>Answer card</PageTab.Title>
        <PageTab.Content tabKey={CARD_TYPE.question}>
          <div>
            <FileUpLoad
              imageUrl=""
              croppedImage={getData(CARD_TYPE.question, 'fileImage')}
              setCroppedImage={(value) => {
                setData(CARD_TYPE.question, 'fileImage', value);
              }}
            />
            <EditorMarkdown
              className="mt-4"
              value={getData(CARD_TYPE.question, 'detail')}
              onChange={(value) => setData(CARD_TYPE.question, 'detail', value)}
              placeholder="Detail..."
            ></EditorMarkdown>
          </div>
        </PageTab.Content>
        <PageTab.Content tabKey={CARD_TYPE.answer}>
          <div>
            <FileUpLoad
              imageUrl=""
              croppedImage={getData(CARD_TYPE.answer, 'fileImage')}
              setCroppedImage={(value) =>
                setData(CARD_TYPE.answer, 'fileImage', value)
              }
            />
            <EditorMarkdown
              className="mt-4"
              value={getData(CARD_TYPE.answer, 'detail')}
              onChange={(value) => setData(CARD_TYPE.answer, 'detail', value)}
              placeholder="Detail..."
            ></EditorMarkdown>
          </div>
        </PageTab.Content>
      </PageTab>
    </>
  );
};

export default CreateQuestionAnswer;
