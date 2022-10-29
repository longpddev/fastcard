import { uuid } from "@/functions/common";
import { memoizeWith } from "ramda";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const URL_URBAN = "https://api.urbandictionary.com/v0";

const fetchData = memoizeWith(
  (str) => str.trim().toLowerCase(),
  async (words) => {
    let result = await fetch(URL_URBAN + `/define?term=${encodeURI(words)}`);
    if (!result.ok) throw new Error("fetch fail");

    result = await result.json();

    return result;
  }
);
/**
 * @typedef {{ definition: string, permalink: string, thumbs_up: number, sound_urls: Array<string>, author: string, word: 'string', defid: number, current_vote: string, written_on: string, example: string, thumbs_down: number}} UrbanData
 * @param {string} words
 * @returns
 */
export default function useUrbanDictionary(words) {
  const [data, dataSet] = useState(null);
  const [error, errorSet] = useState(false);
  const session = useRef();

  const getData = async () => {
    if (!words) return;
    const ses = (session.current = uuid());

    try {
      errorSet(false);
      const result = await fetchData(words);
      if (ses !== session.current) return;
      dataSet(result.list);
    } catch (e) {
      console.error(e);
      dataSet(null);
      errorSet(true);
    }
  };

  useEffect(() => {
    getData();
  }, [words]);

  return {
    data: /** @type { Array<UrbanData> | null } */ (data),
    isLoading: !data && !error,
    isError: error,
    reload: () => getData(),
  };
}
