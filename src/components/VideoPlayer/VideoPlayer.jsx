import React, { useEffect, useRef, useState } from "react";
import { Video } from "./function";
import Segment from "./Segment";
import TypeTranslate from "./TypeTranslate";
const VideoPlayer = ({ srcVideo, transcript }) => {
  const containerVideoRef = useRef();
  const [_, forceRender] = useState();
  const [heightVo, heightVoSet] = useState();
  const videoControl = useRef();
  const [isFullScreen, isFullScreenSet] = useState(false);
  const div = useRef();
  useEffect(() => {
    const divEl = div.current;

    if (!divEl) return;
    const control = (videoControl.current = Video());
    const video = control.getVideoEl();
    control.init(srcVideo, transcript).then(() => {
      divEl.appendChild(video);
      forceRender({});
    });

    control.on("segmentChange", () => {
      forceRender({});
    });

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { height } = entry.contentRect;
        heightVoSet(height);
      }
    });

    observer.observe(video);
    return () => {
      control.destroy();
      observer.disconnect(video);
    };
  }, [srcVideo, transcript]);

  const handleFullScreen = () => {
    const el = containerVideoRef.current;
    if (!el) return;
    if (isFullScreen) {
      document.exitFullscreen().then(() => {
        isFullScreenSet(!isFullScreen);
      });
    } else {
      el.requestFullscreen().then(() => {
        isFullScreenSet(!isFullScreen);
      });
    }
  };
  const control = videoControl.current;
  return (
    <div className="flex flex-wrap">
      <div
        className="relative w-full lg:flex-1 flex items-center"
        ref={containerVideoRef}
      >
        <button
          className="hover:text-orange-400 p-2 absolute top-0 right-0 z-10"
          onClick={handleFullScreen}
        >
          {isFullScreen ? (
            <i class="fa-solid fa-compress"></i>
          ) : (
            <i class="fa-solid fa-expand "></i>
          )}
        </button>
        <div className="w-full" ref={div}></div>
        {control && (
          <TypeTranslate
            className="absolute left-0 bottom-14 w-full px-6 text- text-xl text-center"
            key={control.getCurrentSegment().timeStart}
            text={control.getCurrentSegment().text}
            onDone={() => control.next()}
            style={{ bottom: `${heightVo / 5}px` }}
          ></TypeTranslate>
        )}
      </div>
      {control && (
        <div
          className="overflow-auto w-full lg:w-[350px] lg:h-full p-4 border border-slate-600"
          style={{ height: heightVo === undefined ? "" : heightVo }}
        >
          {control.getAllSegment().map((segment, index) => (
            <Segment segment={segment} key={index}></Segment>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
