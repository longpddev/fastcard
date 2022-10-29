import { useState } from "react";
import Popup from "@components/Popup";
import { KEY_NAME } from "@/constants";

/**
 * @typedef {{ width: number, height: number, url: string, description: string} } Image
 * @param {{ preview: Image, thumb: Image}} param0
 */
const FindImageByWordsItem = ({ preview, thumb }) => {
  const [focus, focusSet] = useState(false);
  const [enter, enterSet] = useState(false);
  return (
    <div className="flex items-center justify-center bg-slate-800 ">
      <div
        className="relative group cursor-pointer rounded-sm  border-2 border-transparent focus:outline-none focus:border-sky-400"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === KEY_NAME.Enter) {
            e.preventDefault();
            e.stopPropagation();
            enterSet(true);
          }
        }}
        onFocus={() => focusSet(true)}
        onBlur={() => {
          focusSet(false);
          enterSet(false);
        }}
      >
        <div className="absolute inset-0 w-full h-full bg-black opacity-30 group-focus:opacity-0"></div>
        <img
          src={thumb.url}
          width={thumb.width || ""}
          height={thumb.height || ""}
          alt={thumb.description}
          title={thumb.description}
        />
      </div>
      <Popup open={enter} setOpen={(status) => enterSet(status)}>
        <img
          src={preview.url}
          width={preview.width}
          height={preview.height}
          alt={preview.description}
          title={preview.description}
        />
      </Popup>
    </div>
  );
};

export default FindImageByWordsItem;
