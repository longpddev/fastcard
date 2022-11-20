import {
  SHORTCUT_VIDEO_PLAYER_TRANSCRIPT_FOCUS,
  SHORTCUT_VIDEO_PLAYER_CHANGE_MODE,
  SHORTCUT_VIDEO_PLAYER_FULLSCREEN,
  SHORTCUT_VIDEO_PLAYER_REPEAT,
  SHORTCUT_VIDEO_PLAYER_NEXT,
} from "@/constants";
import useShortcut from "@hooks/useShortcut";
import React, { useEffect, useRef, useState } from "react";
import { Video } from "./function";
import Segment from "./Segment";
import TypeTranslate from "./TypeTranslate";
import { clsx } from "clsx";
import ButtonShortCut from "@components/ButtonShortCut";
import { SHORTCUT_VIDEO_PLAYER_PREV } from "../../constants/index";

const VideoPlayer = ({
  srcVideo,
  transcript,
  startBy,
  onSegmentChange,
  width,
  height,
}) => {
  const [isFocus, isFocusSet] = useState(false);
  const [easyMode, easyModeSet] = useState(false);
  const containerVideoRef = useRef();
  const [_, forceRender] = useState();
  const [heightVo, heightVoSet] = useState();
  const videoControl =
    /** @type { { current:  import("./function").IVideo | undefined }} */ (
      useRef()
    );
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

  useShortcut(SHORTCUT_VIDEO_PLAYER_REPEAT, () => {
    const videoCl = videoControl.current;
    if (!videoCl || !videoCl.isInitialed()) return;
    videoCl.getCurrentSegment()?.play();
  });

  useShortcut(SHORTCUT_VIDEO_PLAYER_NEXT, () => {
    const videoCl = videoControl.current;
    if (!videoCl || !videoCl.isInitialed()) return;
    videoCl.next();
  });

  useShortcut(SHORTCUT_VIDEO_PLAYER_PREV, () => {
    const videoCl = videoControl.current;
    if (!videoCl || !videoCl.isInitialed()) return;
    videoCl.prev();
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
    <div className="flex flex-wrap" ref={containerVideoRef}>
      <div className="relative w-full lg:flex-1 flex items-center">
        <ButtonShortCut
          shortcut={SHORTCUT_VIDEO_PLAYER_FULLSCREEN}
          className="hover:text-orange-400 p-2 absolute top-0 right-0 z-10"
          onClick={handleFullScreen}
        >
          {isFullScreen ? (
            <i className="fa-solid fa-compress"></i>
          ) : (
            <i className="fa-solid fa-expand "></i>
          )}
        </ButtonShortCut>
        <div className="absolute top-1 right-10 z-10  ">
          <ButtonShortCut
            shortcut={SHORTCUT_VIDEO_PLAYER_CHANGE_MODE}
            onClick={() => easyModeSet(!easyMode)}
            className=" w-6 h-6 bg-slate-200 rounded-full icon-center-button relative"
          >
            {easyMode ? (
              <i className="fa-solid fa-e text-green-400"></i>
            ) : (
              <i className="fa-solid fa-h text-red-400"></i>
            )}
          </ButtonShortCut>
        </div>

        <div
          className={clsx("w-full")}
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
            shortcut={SHORTCUT_VIDEO_PLAYER_TRANSCRIPT_FOCUS}
            key={control.getCurrentSegment().timeStart}
            text={control.getCurrentSegment().text}
            onDone={() => control.next()}
            isFocus={isFocus}
            isFocusSet={isFocusSet}
            alwayShowPlaceholder={easyMode}
            style={{
              bottom: `${
                isFocus ? (isFullScreen ? heightVo / 13 : 0) : heightVo / 10
              }px`,
            }}
          />
        )}
      </div>
      <div
        className=" w-full lg:w-[350px] relative lg:h-full  border border-slate-600"
        style={{
          paddingTop:
            heightVo === undefined
              ? `calc((100% - 350px) * ${height / width})`
              : heightVo + "px",
        }}
      >
        <div className="absolute inset-0 w-full h-full overflow-auto p-4">
          {control &&
            control.isInitialed() &&
            control
              .getAllSegment()
              .map((segment, index) => (
                <Segment segment={segment} key={index}></Segment>
              ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
