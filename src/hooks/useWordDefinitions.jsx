import { memoizeWith } from "ramda";
import { useEffect, useState } from "react";
import { useRef } from "react";

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const fetchData = memoizeWith(
  (str) => str.trim().toLowerCase(),
  async (word) => {
    let result = await fetch(BASE_URL + word);
    if (!result.ok) throw new Error("No Definitions Found");
    result = await result.json();

    return result[0];
  }
);

export default function useWordDefinitions(word, onError) {
  const [data, dataSet] = useState();

  const [notFound, notFoundSet] = useState(false);
  const ref = useRef();
  const forwardRef = useRef();
  forwardRef.current = {
    onError,
  };
  const createSession = () =>
    (ref.current = Math.random().toString(32).slice(2, 7));
  const getData = async () => {
    const fw = forwardRef.current;
    try {
      if (!word) {
        return;
      }
      dataSet(undefined);
      const session = createSession();
      const json = await fetchData(word);
      if (session !== ref.current) return;
      dataSet(json);
      notFoundSet(false);
    } catch (e) {
      console.log(e);
      dataSet(undefined);
      notFoundSet(true);
      fw.onError && fw.onError(e);
    }
  };
  useEffect(() => {
    getData();
  }, [word]);
  return {
    isLoading: !data && !notFound,
    data: data,
    reload: () => getData(),
    isNotfound: notFound,
  };
}
