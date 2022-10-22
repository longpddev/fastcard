import { useEffect, useState } from "react";
import { useRef } from "react";

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

export default function useWordDefinitions(word) {
  const [data, dataSet] = useState();
  const [notFound, notFoundSet] = useState(false);
  const ref = useRef();

  const createSession = () =>
    (ref.current = Math.random().toString(32).slice(2, 7));
  const getData = async () => {
    try {
      if (!word) {
        return;
      }
      const session = createSession();
      const result = await fetch(BASE_URL + word);

      if (!result.ok) throw new Error("No Definitions Found");
      const json = await result.json();
      if (session !== ref.current) return;
      dataSet(json);
      notFoundSet(false);
    } catch (e) {
      console.log(e);
      notFoundSet(true);
    }
  };
  useEffect(() => {
    getData();
  }, [word]);
  return {
    isLoading: !data,
    data: data,
    reload: () => getData(),
    isNotfound: notFound,
  };
}
