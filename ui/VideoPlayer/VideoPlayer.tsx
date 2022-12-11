'use client';

import {
  SHORTCUT_VIDEO_PLAYER_TRANSCRIPT_FOCUS,
  SHORTCUT_VIDEO_PLAYER_CHANGE_MODE,
  SHORTCUT_VIDEO_PLAYER_FULLSCREEN,
  SHORTCUT_VIDEO_PLAYER_REPEAT,
  SHORTCUT_VIDEO_PLAYER_NEXT,
} from '@/constants/index';
import useShortcut from '@/hooks/useShortcut';
import React, { useEffect, useRef, useState } from 'react';
import { ITranscript, Video, ISegment, IVideoPlayer } from './function';
import Segment from './Segment';
import TypeTranslate from './TypeTranslate';
import { clsx } from 'clsx';
import ButtonShortCut from '@/ui/ButtonShortCut';
import { SHORTCUT_VIDEO_PLAYER_PREV } from '@/constants/index';
import { IReactProps } from '@/interfaces/common';

const VideoPlayer: IReactProps<{
  srcVideo: string;
  transcript: ITranscript;
  startBy: number;
  onSegmentChange: (s: ISegment) => void;
  width: number;
  height: number;
}> = ({ srcVideo, transcript, startBy, onSegmentChange, width, height }) => {
  const [isFocus, isFocusSet] = useState(false);
  const [easyMode, easyModeSet] = useState(false);
  const containerVideoRef = useRef<HTMLDivElement>(null);
  const [_, forceRender] = useState({});
  const [heightVo, heightVoSet] = useState<number | null>(null);
  const videoControl = useRef({} as IVideoPlayer);
  const [isFullScreen, isFullScreenSet] = useState(false);
  const div = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const divEl = div.current;

    if (!divEl) return;
    const control = (videoControl.current = Video({
      className: 'w-full h-full',
      attr: {
        width: width.toString(),
        height: height.toString(),
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

    control.on('segmentChange', (segment) => {
      forceRender({});
      onSegmentChange && onSegmentChange(segment as ISegment);
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
      observer.disconnect();
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

    const handleFullScreenChange = () => {
      if (document.fullscreenElement) {
        isFullScreenSet(true);
      } else {
        isFullScreenSet(false);
      }
    };

    containerEl.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      containerEl.removeEventListener(
        'fullscreenchange',
        handleFullScreenChange,
      );
    };
  }, []);

  return (
    <div className="flex flex-wrap" ref={containerVideoRef}>
      <div className="relative flex w-full items-center lg:flex-1">
        <ButtonShortCut
          shortcut={SHORTCUT_VIDEO_PLAYER_FULLSCREEN}
          className="absolute top-0 right-0 z-10 p-2 hover:text-orange-400"
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
            className=" icon-center-button relative h-6 w-6 rounded-full bg-slate-200"
          >
            {easyMode ? (
              <i className="fa-solid fa-e text-green-400"></i>
            ) : (
              <i className="fa-solid fa-h text-red-400"></i>
            )}
          </ButtonShortCut>
        </div>

        <div
          className={clsx('w-full')}
          style={{ aspectRatio: width / height }}
          ref={div}
        ></div>
        {control && control.isInitialed() && (
          <TypeTranslate
            className={clsx(
              'absolute left-0 bottom-14 w-full px-6 text-center text-xl md:py-2 md:text-2xl',
              {
                'before:pointer-events-none before:absolute before:inset-0 before:block before:h-full before:w-full before:bg-black before:opacity-20':
                  isFocus,
              },
            )}
            shortcut={SHORTCUT_VIDEO_PLAYER_TRANSCRIPT_FOCUS}
            key={control.getCurrentSegment().timeStart}
            text={control.getCurrentSegment().text}
            onDone={() => control.next()}
            isFocus={isFocus}
            isFocusSet={isFocusSet}
            alwayShowPlaceholder={easyMode}
            style={
              heightVo
                ? {
                    bottom: `${
                      isFocus
                        ? isFullScreen
                          ? heightVo / 13
                          : 0
                        : heightVo / 10
                    }px`,
                  }
                : {}
            }
          />
        )}
      </div>
      <div
        className=" relative w-full border border-slate-600  lg:h-full lg:w-[350px]"
        style={{
          paddingTop:
            heightVo === undefined
              ? `calc((100% - 350px) * ${height / width})`
              : heightVo + 'px',
        }}
      >
        <div className="absolute inset-0 h-full w-full overflow-auto p-4">
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
