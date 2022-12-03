'use client';

import { memoizeWith } from 'ramda';
import { useEffect, useState } from 'react';
import { useRef } from 'react';

interface IDictionaryapiLicense {
  name: string;
  url: string;
}
interface IDictionaryapiPhonetic {
  audio: string;
  sourceUrl?: string;
  license?: IDictionaryapiLicense;
  text?: string;
}
interface IDictionaryapiMeaning {
  partOfSpeech: 'noun' | 'verb' | 'interjection';
  definitions: Array<{
    definition: 'string';
    synonyms: Array<string>;
    antonyms: Array<string>;
    example?: string;
  }>;
  synonyms: Array<string>;
  antonyms: Array<string>;
}

type IDictionaryapiSourceUrl = Array<string>;
interface IDictionaryapiResponse {
  word: string;
  phonetics: Array<IDictionaryapiPhonetic>;
  meanings: Array<IDictionaryapiMeaning>;
  license: IDictionaryapiLicense;
  sourceUrls: Array<IDictionaryapiSourceUrl>;
}

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const fetchData = memoizeWith<(str: string) => Promise<IDictionaryapiResponse>>(
  (str) => str.trim().toLowerCase(),
  async (word) => {
    let result = await fetch(BASE_URL + word);
    if (!result.ok) throw new Error('No Definitions Found');
    const resultJson = (await result.json()) as Array<IDictionaryapiResponse>;

    return resultJson[0];
  },
);

export default function useWordDefinitions(
  word: string,
  onError?: (e: any) => void,
) {
  const [data, dataSet] = useState<undefined | IDictionaryapiResponse>();

  const [notFound, notFoundSet] = useState(false);
  const ref = useRef<string>();
  const forwardRef = useRef() as {
    current: Record<string, ((e: any) => void) | undefined>;
  };
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
