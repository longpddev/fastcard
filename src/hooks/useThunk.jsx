import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { watchThunk } from "../functions/common";
import { pushToast } from "../components/Toast/core";
import { progressWatchPromise } from "../components/ProgressGlobal";
export function useThunk(thunk, params) {
  const dispatch = useDispatch();
  const [result, resultSet] = useState();

  useEffect(() => {
    dispatch(thunk(params))
      .then(watchThunk)
      .then(({ payload }) => resultSet(payload))
      .catch(() => pushToast.error("Load data fail"))
      .finally(progressWatchPromise());
  }, [params]);

  return result;
}
