import { titlePage } from "@/functions/common";
import { path } from "ramda";
import React, { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingIcon from "@components/LoadingIcon";
import { initProcess } from "@services/card/cardSlice";

const CardLearn = React.lazy(() => import("@components/CardLearn"));
const Learning = () => {
  titlePage("Learning");
  let { groupId } = useParams();
  groupId = parseInt(groupId);
  const isExistInLearn = useSelector((s) =>
    Boolean(s.card.learnToday.entities[groupId])
  );
  const isInitProcess = useSelector((s) =>
    Boolean(s.card.process[groupId] !== undefined)
  );
  const isExistCardForLearn = useSelector((s) =>
    Boolean(path(["card", "rows", 0])(s.card.learnToday.entities[groupId]))
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (isInitProcess) return;

    dispatch(initProcess({ groupId }));
  }, []);
  if (!isExistInLearn || !isInitProcess)
    return (
      <div className="">
        <LoadingIcon></LoadingIcon>
      </div>
    );

  if (!isExistCardForLearn)
    return (
      <>
        <h2 className="text-center text-4xl ">
          You do not have a card to learn today
        </h2>
        <div className="firework-delay"></div>
        <div className="firework"></div>
      </>
    );
  return (
    <Suspense fallback={null}>
      <CardLearn groupId={groupId}></CardLearn>
    </Suspense>
  );
};

export default Learning;
