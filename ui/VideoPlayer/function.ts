'use client';

import Emitter from 'helpers/emitter';

export interface IVideoPlayerControl {
  currentTime: () => number;
  setSrc: (src: any) => Promise<any>;
  destroy: () => void;
  goto: (time: any) => Promise<void>;
  duration: () => number;
  pause: () => Promise<void>;
  play: () => Promise<void>;
  getVideoEl: () => HTMLVideoElement;
  emitter: any;
  control: (show: any) => void;
}

export interface IVideoPlayer {
  destroy: () => void;
  init: (videoUrl: any, transcript: any) => Promise<any>;
  getCurrentSegment: () => ISegment;
  isInitialed: () => boolean;
  getVideoEl: () => HTMLVideoElement;
  prevSegment: () => any;
  getAllSegment: () => Array<any>;
  on: (event: any, callback: (v: unknown) => void) => any;
  videoCl: IVideoPlayerControl;
  next: () => void;
  prev: () => void;
  setSegmentByTime: (v: number) => void;
}

export interface ISegment {
  text: string;
  timeStart: number;
  timeEnd: number;
  timeFormat: string;
  init: () => Promise<void>;
  next: () => void;
  prev: () => void;
  activeMe: () => void;
  isActive: () => boolean;
  play: () => Promise<void>;
}

export interface ITranscript {
  text: string;
  timeFormat: string;
  time: number;
  timeEnd: number;
}
export interface ISegmentParams {
  text: string;
  timeFormat: string;
  timeStart: number;
  timeEnd: number;
  videoCl: IVideoPlayerControl;
  nextSegment: () => void;
  prevSegment: () => void;
  index: number;
  currentSegment: (index?: number) => number;
}

export function segment({
  text,
  timeFormat,
  timeStart,
  timeEnd,
  videoCl,
  nextSegment,
  prevSegment,
  index,
  currentSegment,
}: ISegmentParams): ISegment {
  async function init() {
    await videoCl.goto(timeStart);
  }

  function next() {
    nextSegment();
  }

  function prev() {
    prevSegment();
  }

  function activeMe() {
    currentSegment(index);
    play();
  }

  async function play() {
    await init();
    videoCl.play();
  }

  function isActive() {
    return currentSegment() === index;
  }
  return {
    text,
    timeStart,
    timeEnd,
    timeFormat,
    init,
    next,
    prev,
    activeMe,
    isActive,
    play,
  };
}

export interface IVideoPlayerSettings {
  className?: string;
  attr?: Record<string, string>;
}
/**
 *
 * @param {*} settings
 * @returns { IVideoPlayer }
 */
export function Video(settings: IVideoPlayerSettings = {}): IVideoPlayer {
  const videoCl = videoControl();
  const emitter = new Emitter();
  let initialed = false;

  /** @type{ ISegment[] } */
  const _segments: Array<ISegment> = [];

  const _segmentsIndexing: Record<string, number> = {};
  let _currentSegment = 0;

  videoCl.emitter.on('video:timeupdate', () => {
    const currentTime = Math.ceil(videoCl.currentTime() * 10) / 10;
    // console.log(currentTime, getCurrentSegment().timeEnd);
    if (currentTime >= getCurrentSegment().timeEnd) videoCl.pause();
  });

  const el = videoCl.getVideoEl();

  if (settings.className) {
    el.classList.add(...settings.className.split(' '));
  }

  if (settings.attr) {
    for (const [key, value] of Object.entries(settings.attr)) {
      el.setAttribute(key, value);
    }
  }

  function nextSegment() {
    return currentSegment(currentSegment() + 1, true);
  }

  function prevSegment() {
    return currentSegment(currentSegment() - 1);
  }

  function setSegmentByTime(time: number) {
    if (!(time in _segmentsIndexing))
      throw new Error(`Time: ${time} do not exist!`);
    const index = _segmentsIndexing[time];
    currentSegment(index);
    getCurrentSegment().activeMe();
  }

  function currentSegment(value?: number, isLoop = false) {
    if (!value || isNaN(value)) {
      return _currentSegment;
    }
    if (value >= _segments.length) {
      if (isLoop) {
        value = 0;
      } else {
        value = _segments.length - 1;
      }
    }
    if (value < 0) value = 0;
    emitter.emit('segmentChange', _segments[value]);
    return (_currentSegment = value);
  }

  function on(event: string, callback: (v: unknown) => void) {
    emitter.on(event, callback);

    return () => emitter.off(event, callback);
  }

  /**
   * @returns { ISegment }
   */
  function getCurrentSegment() {
    return _segments[currentSegment()];
  }

  function getAllSegment() {
    return [..._segments];
  }

  function addSegment(data: ITranscript, index: number) {
    _segments.push(
      segment({
        text: data.text,
        timeEnd: data.timeEnd,
        timeStart: data.time,
        timeFormat: data.timeFormat,
        videoCl,
        nextSegment,
        prevSegment,
        currentSegment,
        index,
      }),
    );

    _segmentsIndexing[data.time.toString()] = _segments.length - 1;
  }
  function init(videoUrl: string, transcript: Array<ITranscript>) {
    return new Promise((res, rej) => {
      videoCl.setSrc(videoUrl).then(() => {
        const duration = videoCl.duration();
        transcript.forEach((item, index) => {
          const nextTranscript = index + 1;
          const timeEnd =
            nextTranscript + 1 > transcript.length
              ? duration
              : transcript[nextTranscript].time;
          addSegment({ ...item, timeEnd }, index);
        });
        initialed = true;
        res(true);
      });
    });
  }

  function destroy() {
    videoCl.destroy();
    Object.keys(emitter.e).forEach((name) => emitter.off(name));
  }

  return {
    destroy,
    init,
    getCurrentSegment,
    isInitialed: () => initialed,
    getVideoEl: videoCl.getVideoEl,
    getAllSegment,
    on,
    videoCl,
    next: () => {
      nextSegment();
      const currentSegment = getCurrentSegment();
      currentSegment.activeMe();
    },
    prev: () => {
      prevSegment();
      const currentSegment = getCurrentSegment();
      currentSegment.activeMe();
    },
    setSegmentByTime,
    prevSegment,
  };
}

function createElementVideo() {
  const videoEl = document.createElement('video');
  videoEl.setAttribute('controls', '');
  return videoEl;
}

function mapEventVideoElementToEmitter(
  emitter: Emitter,
  videoEl: HTMLVideoElement,
) {
  const listEvent = [
    'loadeddata',
    'canplay',
    'canplaythrough',
    'complete',
    'durationchange',
    'emptied',
    'ended',
    'loadedmetadata',
    'pause',
    'play',
    'playing',
    'progress',
    'ratechange',
    'seeked',
    'seeking',
    'stalled',
    'suspend',
    'timeupdate',
    'volumechange',
    'waiting',
  ];

  listEvent.forEach((name) => {
    videoEl.addEventListener(name, function () {
      // console.log("video:" + name);
      emitter.emit('video:' + name, arguments);
    });
  });
}
/**
 * @returns {IVideoPlayerControl}
 */
export function videoControl() {
  let videoEl = createElementVideo();
  const emitter = new Emitter();

  mapEventVideoElementToEmitter(emitter, videoEl);

  function setSrc(src: string) {
    return new Promise<boolean>((res, rej) => {
      videoEl.src = src;

      emitter.once('video:loadeddata', () => {
        res(true);
      });
    });
  }

  function destroy() {
    videoEl.remove();
    Object.keys(emitter.e).forEach((name) => emitter.off(name));
  }

  async function goto(time: number) {
    videoEl.currentTime = time;
  }

  function duration() {
    return videoEl.duration;
  }

  async function pause() {
    return videoEl.pause();
  }

  async function play() {
    return videoEl.play();
  }

  function getVideoEl() {
    return videoEl;
  }

  function control(show: boolean) {
    if (show) {
      videoEl.setAttribute('controls', '');
    } else {
      videoEl.removeAttribute('controls');
    }
  }
  return {
    currentTime: () => videoEl.currentTime,
    setSrc,
    destroy,
    goto,
    duration,
    pause,
    play,
    getVideoEl,
    emitter,
    control,
  };
}
