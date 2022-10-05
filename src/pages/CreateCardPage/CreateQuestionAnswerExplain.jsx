import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import FastCreateOrSelectGroup from "../../components/FastCreateOrSelectGroup";
import FileUpLoad from "../../components/FileUpLoad";
import PageTab from "../../components/PageTab";
import { pushToast } from "../../components/Toast";
import EditorMarkdown from "../../components/EditorMarkdown";
import {
  capitalize,
  getFileImageField,
  run,
  watchThunk,
} from "../../functions/common";
import { createCardThunk } from "../../services/card/cardSlice";
import { progressWatchPromise } from "../../components/ProgressGlobal";
const CARD_TYPE = {
  card_group: "card_group",
  question: "question",
  answer: "answer",
  explain: "explain",
};

const useFormData = run(() => {
  const initState = () => {
    return Object.keys(CARD_TYPE).reduce((acc, key) => {
      acc[key] = {
        fileImage: null,
        detail: "",
      };

      return acc;
    }, {});
  };
  return () => {
    const [data, setData] = useState(initState);
    return {
      getData: (tab, field) => data[tab][field],
      setData: (tab, field, value) => {
        setData((prev) => {
          if (prev[tab][field] === value) return prev;

          return {
            ...prev,
            [tab]: {
              ...prev[tab],
              [field]: value,
            },
          };
        });
      },
      reset: () => setData(initState()),
    };
  };
});

const CreateQuestionAnswerExplain = () => {
  const dispatch = useDispatch();
  const { getData, setData, reset } = useFormData();
  const [groupId, groupIdSet] = useState("");
  const controlRef = useRef();
  const validGroup = () => {
    const result = Boolean(groupId);
    if (!result) pushToast.warning("Please chose group card");
    return result;
  };
  const checkValid = (tabKey) => {
    const validCardContent = (type) => {
      // if (!getData(type, "fileImage")) {
      //   pushToast.warning(
      //     `Field image of ${capitalize(tabKey)} card is require`
      //   );
      //   return false;
      // }

      if (!getData(type, "detail")) {
        pushToast.warning(
          `Field detail of ${capitalize(tabKey)} card is require`
        );
        return false;
      }

      return true;
    };

    const caseOb = {
      [CARD_TYPE.card_group]: () => validGroup(),
      [CARD_TYPE.question]: () => validCardContent(CARD_TYPE.question),
      [CARD_TYPE.answer]: () => validCardContent(CARD_TYPE.answer),
      [CARD_TYPE.explain]: () => validCardContent(CARD_TYPE.explain),
    };

    return caseOb[tabKey]();
  };
  const gotoTop = () => window.scrollTo({ top: 0, left: 0 });
  const handleNext = () => gotoTop();

  return (
    <>
      <div className="mb-6 block-up bg-slate-800 rounded-md px-4 py-3">
        <FastCreateOrSelectGroup
          value={groupId}
          onChange={(e) => {
            groupIdSet(parseInt(e.target.value));
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
          dispatch(
            createCardThunk({
              groupId,
              question: {
                fileImage: getFileImageField(
                  getData(CARD_TYPE.question, "fileImage")
                ),
                detail: getData(CARD_TYPE.question, "detail"),
              },
              explain: {
                fileImage: getFileImageField(
                  getData(CARD_TYPE.explain, "fileImage")
                ),
                detail: getData(CARD_TYPE.explain, "detail"),
              },
              answer: {
                fileImage: getFileImageField(
                  getData(CARD_TYPE.answer, "fileImage")
                ),
                detail: getData(CARD_TYPE.answer, "detail"),
              },
            })
          )
            .then(watchThunk)
            .then(() => {
              reset();
              gotoTop();
              controlRef.current && controlRef.current.reset();
              pushToast.success("Create card success");
            })
            .catch(() => {
              pushToast.error("Sometime error please try again!");
            })
            .finally(progressWatchPromise());
        }}
      >
        <PageTab.Title tabKey={CARD_TYPE.question}>Question card</PageTab.Title>
        <PageTab.Title tabKey={CARD_TYPE.answer}>Answer card</PageTab.Title>
        <PageTab.Title tabKey={CARD_TYPE.explain}>Explain card</PageTab.Title>
        <PageTab.Content tabKey={CARD_TYPE.question}>
          <div>
            <FileUpLoad
              croppedImage={getData(CARD_TYPE.question, "fileImage")}
              setCroppedImage={(value) => {
                setData(CARD_TYPE.question, "fileImage", value);
              }}
            />
            <EditorMarkdown
              className="mt-4"
              value={getData(CARD_TYPE.question, "detail")}
              onChange={(value) => setData(CARD_TYPE.question, "detail", value)}
              placeholder="Detail..."
            ></EditorMarkdown>
          </div>
        </PageTab.Content>
        <PageTab.Content tabKey={CARD_TYPE.answer}>
          <div>
            <FileUpLoad
              croppedImage={getData(CARD_TYPE.answer, "fileImage")}
              setCroppedImage={(value) =>
                setData(CARD_TYPE.answer, "fileImage", value)
              }
            />
            <EditorMarkdown
              className="mt-4"
              value={getData(CARD_TYPE.answer, "detail")}
              onChange={(value) => setData(CARD_TYPE.answer, "detail", value)}
              placeholder="Detail..."
            ></EditorMarkdown>
          </div>
        </PageTab.Content>
        <PageTab.Content tabKey={CARD_TYPE.explain}>
          <div>
            <FileUpLoad
              croppedImage={getData(CARD_TYPE.explain, "fileImage")}
              setCroppedImage={(value) => {
                setData(CARD_TYPE.explain, "fileImage", value);
              }}
            />
            <EditorMarkdown
              className="mt-4"
              value={getData(CARD_TYPE.explain, "detail")}
              onChange={(value) => setData(CARD_TYPE.explain, "detail", value)}
              placeholder="Detail..."
            ></EditorMarkdown>
          </div>
        </PageTab.Content>
      </PageTab>
    </>
  );
};

export default CreateQuestionAnswerExplain;
