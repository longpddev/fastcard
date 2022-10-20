import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { watchThunk } from "../functions/common";
import { pushToast } from "../components/Toast/core";
import { progressWatchPromise } from "../components/ProgressGlobal";
export function useThunk(thunk, params) {
  const dispatch = useDispatch();
  const fetchData = useRef();
  const [result, resultSet] = useState();
  fetchData.current = () =>
    dispatch(thunk(params))
      .then(watchThunk)
      .then(({ payload }) => resultSet(payload))
      .catch(() => pushToast.error("Load data fail"))
      .finally(progressWatchPromise());
  useEffect(() => {
    fetchData.current();
  }, [params]);

  return {
    data: result,
    reload: useCallback(() => fetchData.current(), []),
  };
}
