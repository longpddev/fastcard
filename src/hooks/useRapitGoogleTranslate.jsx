const TARGET = "vi";
import { uuid } from "@/functions/common";
import { memoizeWith } from "ramda";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

// option https://deep-translator-api.azurewebsites.net/docs#/default/google_translate_google__post

// https://rapidapi.com/gatzuma/api/deep-translate1
const SOURCE = "en";
const RAPIT_GOOGLE_TRANSLATE =
  "https://deep-translate1.p.rapidapi.com/language/translate/v2";

const fetchData = memoizeWith(
  (str) => str.trim().toLowerCase(),
  async (words) => {
    // const encodedParams = new URLSearchParams();
    // encodedParams.append("q", words);
    // encodedParams.append("target", TARGET);
    // encodedParams.append("source", SOURCE);

    const encodedParams = JSON.stringify({
      q: words,
      target: TARGET,
      source: SOURCE,
    });
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "ed44da7132msh9946c32f64aa96bp14d931jsn4dce01ab9245",
        "X-RapidAPI-Host": "deep-translate1.p.rapidapi.com",
      },
      body: encodedParams,
    };
    let result = await fetch(RAPIT_GOOGLE_TRANSLATE, options);
    if (!result.ok) throw new Error("translate fail");
    result = await result.json();
    const translations = result.data.translations;
    result.data.translations = [translations];
    return result.data;
  }
);

export default function useRapitGoogleTranslate(words) {
  const [data, dataSet] = useState(null);
  const [error, errorSet] = useState(false);
  const ref = useRef();

  const handleFetch = async () => {
    const session = (ref.current = uuid());
    try {
      dataSet(null);
      errorSet(false);
      const result = await fetchData(words);
      if (ref.current !== session) return;
      dataSet(result);
      errorSet(false);
    } catch (e) {
      dataSet(null);
      errorSet(true);
      console.error(e);
    }
  };
  useEffect(() => {
    if (words.trim().length === 0) return;
    handleFetch();
  }, [words]);

  return {
    data,
    isLoading: !Boolean(data) && !error,
    error,
    reload: () => handleFetch(),
  };
}
