import { uuid } from "@/functions/common";
import { memoizeWith } from "ramda";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

const SHUTTERSTOCK_API_TOKEN =
  "v2/em5kYU9ERHVjMEsyWEt0aG1tazZaYnZndjNjV3ZZczQvMzU5ODMyNjQ1L2N1c3RvbWVyLzQvalBWTTR6NWV2bmUxNlFtYnE5YkMxVW1veDUyM2w2ZmJUX0pnTGs0ekdJbW1QbmlOVzdXRTRkR08xczFQd0ZfSW9sY0lVcmoyRVZJcU10cjExZVZROWFUZ29GUEpnU3RocUwwWHd3S3NvLUhIYmM5b19CTTZITTZVX1IyQ2dTMlBDT093X1lDd1FjRTJyd2Y2enVjTk95TFZtUmFFZDZHeDk2YlRqYXpHZWpGUHowRGxQcGVnYVZPNF96ZmRUWWlEYzg1OHNPWUh5MjRQTEpaN1pJdWRQUS9KM3RYdEJlSG95bzRnbXJod1Nma05B";

const fetchData = memoizeWith(
  (str) => str.trim().toLowerCase(),
  async (words) => {
    const params = new URLSearchParams();

    params.set("query", words);
    params.set("image_type", "photo");

    let result = await fetch(
      "https://api.shutterstock.com/v2/images/search" + "?" + params.toString(),
      {
        headers: {
          Authorization: `Bearer ${SHUTTERSTOCK_API_TOKEN}`,
        },
      }
    );

    if (!result.ok) throw new Error("request fail");

    result = await result.json();

    return result;
  }
);

export default function useFindImageByWords(words) {
  const session = useRef();
  const [data, dataSet] = useState(null);
  const [error, errorSet] = useState(false);
  const getData = async () => {
    const ses = (session.current = uuid());
    try {
      errorSet(false);
      const result = await fetchData(words);
      if (session.current !== ses) return;
      dataSet(result);
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
    data,
    isError: error,
    isLoading: !data && !error,
    reload: () => getData(),
  };
}
