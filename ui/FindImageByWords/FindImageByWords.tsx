'use client';

import useFindImageByWords from '@/hooks/useFindImageByWords';
import FindImageByWordsItem from './FindImageByWordsItem';

const FindImageByWords = ({ words }) => {
  const { data, isError } = useFindImageByWords(words);
  const items = data?.data || [];
  return (
    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-5">
      {items.map((item) => (
        <FindImageByWordsItem
          key={item.id}
          preview={item.assets.preview_1000}
          thumb={item.assets.large_thumb}
        />
      ))}
    </div>
  );
};

export default FindImageByWords;
