import useFindImageByWords from "@hooks/useFindImageByWords";
import FindImageByWordsItem from "./FindImageByWordsItem";

const FindImageByWords = ({ words }) => {
  const { data, isError } = useFindImageByWords(words);
  console.log(data);
  const items = data?.data || [];
  return (
    <div className="gap-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <FindImageByWordsItem
          key={item.id}
          preview={item.assets.preview_1500}
          thumb={item.assets.large_thumb}
        />
      ))}
    </div>
  );
};

export default FindImageByWords;
