import { KEY_NAME, SPECIAL_KEY } from "@/constants/index";
import useShortcut from "@hooks/useShortcut";
import React, { useEffect, useRef, useState } from "react";
import { Video } from "./function";
import Segment from "./Segment";
import TypeTranslate from "./TypeTranslate";
import { clsx } from "clsx";

const VideoPlayer = ({
  srcVideo,
  transcript,
  startBy,
  onSegmentChange,
  width,
  height,
}) => {
  const [isFocus, isFocusSet] = useState(false);
  const containerVideoRef = useRef();
  const [_, forceRender] = useState();
  const [heightVo, heightVoSet] = useState();
  const videoControl = useRef();
  const [isFullScreen, isFullScreenSet] = useState(false);
  const div = useRef();
  useEffect(() => {
    const divEl = div.current;

    if (!divEl) return;
    const control = (videoControl.current = Video({
      className: "w-full h-full",
      attr: {
        width,
        height,
      },
    }));
    const video = control.getVideoEl();
    control.init(srcVideo, transcript).then(() => {
      divEl.appendChild(video);
      forceRender({});
      if (startBy) {
        try {
          control.setSegmentByTime(startBy);
        } catch (e) {
          console.error(e);
        }
      }
    });

    control.on("segmentChange", (segment) => {
      forceRender({});
      onSegmentChange && onSegmentChange(segment);
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
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  };
  const control = videoControl.current;

  useEffect(() => {
    const videoCl = videoControl.current;

    if (!videoCl || (videoCl && !videoCl.isInitialed())) return;
    videoCl.videoCl.control(!isFocus);
  }, [isFocus, control && control.isInitialed()]);

  useShortcut(SPECIAL_KEY.Ctrl + "r", (e) => {
    const videoCl = videoControl.current;
    if (!videoCl || !videoCl.isInitialed()) return;
    e.preventDefault();
    videoCl.getCurrentSegment()?.play();
  });

  useShortcut(
    KEY_NAME.F11,
    (e) => {
      e.preventDefault();
      handleFullScreen();
    },
    [isFullScreen]
  );

  useShortcut(SPECIAL_KEY.Ctrl + KEY_NAME.Enter, (e) => {
    e.preventDefault();
    isFocusSet(true);
  });

  useEffect(() => {
    const containerEl = containerVideoRef.current;

    if (!containerEl) return;

    const handleFullScreenChange = (e) => {
      if (document.fullscreenElement) {
        isFullScreenSet(true);
      } else {
        isFullScreenSet(false);
      }
    };

    containerEl.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      containerEl.removeEventListener(
        "fullscreenchange",
        handleFullScreenChange
      );
    };
  }, []);

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
            <i className="fa-solid fa-compress"></i>
          ) : (
            <i className="fa-solid fa-expand "></i>
          )}
        </button>
        <div
          className={clsx("w-full", {
            "h-full": isFullScreen,
          })}
          style={{ aspectRatio: width / height }}
          ref={div}
        ></div>
        {control && control.isInitialed() && (
          <TypeTranslate
            className={clsx(
              "absolute left-0 bottom-14 w-full px-6 md:py-2 md:text-2xl text-xl text-center",
              {
                "before:block before:inset-0 before:absolute before:pointer-events-none before:opacity-20 before:bg-black before:w-full before:h-full":
                  isFocus,
              }
            )}
            key={control.getCurrentSegment().timeStart}
            text={control.getCurrentSegment().text}
            onDone={() => control.next()}
            isFocus={isFocus}
            isFocusSet={isFocusSet}
            style={{
              bottom: `${
                isFocus ? (isFullScreen ? heightVo / 13 : 0) : heightVo / 10
              }px`,
            }}
          ></TypeTranslate>
        )}
      </div>
      {control && control.isInitialed() && (
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
