import React, { useMemo, useState } from "react";
import { clientAuth, getMedia } from "@/api/client";
import { isCurrentOrigin, isValidUrl } from "@/functions/common";

import Popup from "../Popup";
import { pushToast } from "../Toast";
import PopupCropMain from "./PopupCropMain";

const getSourceUrl = async (url) => {
  if (isCurrentOrigin(url)) {
    return url;
  } else {
    const result = await clientAuth.POST("/file-temp/get", {
      body: {
        url,
      },
    });

    return getMedia(result.data.path);
  }
};

const PopupCrop = ({ url, open, setOpen, ...props }) => {
  const [urlCurrentOrigin, setUrlCurrentOrigin] = useState();
  useMemo(() => {
    if (!url) return;
    if (!isValidUrl(url)) {
      pushToast.error("Url invalid please try another one!");
      return;
    }

    getSourceUrl(url)
      .then((res) => setUrlCurrentOrigin(res))
      .catch((error) => pushToast.error(error.message));
  }, [url]);

  return (
    <div>
      <Popup open={open} setOpen={setOpen} maxWidth={900}>
        {urlCurrentOrigin ? (
          <PopupCropMain
            cropHeight={600}
            url={urlCurrentOrigin}
            setOpen={setOpen}
            {...props}
          />
        ) : (
          <div
            style={{ minHeight: "600px" }}
            className="w-full flex items-center justify-center"
          >
            <i className="fas fa-spinner animate-spin text-4xl text-sky-400"></i>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default PopupCrop;
