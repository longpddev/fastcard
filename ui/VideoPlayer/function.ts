'use client';

import { TinyEmitter } from 'tiny-emitter';

/**
 *  @typedef {{
 *    currentTime: () => number;
 *    setSrc: (src: any) => Promise<any>;
 *    destroy: () => void;
 *    goto: (time: any) => Promise<void>;
 *    duration: () => number;
 *    pause: () => Promise<void>;
 *    play: () => Promise<void>;
 *    getVideoEl: () => HTMLVideoElement;
 *    emitter: any;
 *    control: (show: any) => void;
 * }} IVideoControl
 *
 *  @typedef {{
 *    destroy: () => void,
 *    init: (videoUrl: any, transcript: any) => Promise<any>,
 *    getCurrentSegment: () => ISegment,
 *    isInitialed: () => boolean,
 *    getVideoEl: () => HTMLVideoElement,
 *    prevSegment: () => any,
 *    getAllSegment: () => Array<any>
 *    on: (event: any, callback: any): () => any
 *    videoCl: IVideoControl
 *    next: () => void
 *    prev: () => void
 *    setSegmentByTime: () => void
 * }} IVideo
 *
 * @typedef {{
 *  text: string,
 *  timeStart: number,
 *  timeEnd: number,
 *  timeFormat: string,
 *  init: Promise<void>,
 *  next: () => void,
 *  prev: () => void,
 *  activeMe: () => void,
 *  isActive: () => boolean,
 *  play: () => Promise<void>,
 * }} ISegment
 */

/**
 * @param {{
 *   text: string,
 *   timeFormat: string,
 *   timeStart: number,
 *   timeEnd: number,
 *   videoCl: IVideoControl,
 *   nextSegment: () => void,
 *   prevSegment: () => void,
 *   index: number,
 *   currentSegment: (index: undefined | number) => number,
 * }} param0
 * @returns { ISegment }
 */
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
}) {
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
/**
 *
 * @param {*} settings
 * @returns { IVideo }
 */
export function Video(settings = {}) {
  const videoCl = videoControl();
  const emitter = new TinyEmitter();
  let initialed = false;

  /** @type{ ISegment[] } */
  const _segments = [];

  /** @type{{ [key: number ] : ISegment}} */
  const _segmentsIndexing = {};
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

  function setSegmentByTime(time) {
    if (!(time in _segmentsIndexing))
      throw new Error(`Time: ${time} do not exist!`);
    const index = _segmentsIndexing[time];
    currentSegment(index);
    getCurrentSegment().activeMe();
  }

  function currentSegment(value, isLoop = false) {
    if (isNaN(value)) {
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

  function on(event, callback) {
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

  function addSegment(data, index) {
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
  function init(videoUrl, transcript) {
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
  window.videoCl = videoCl;
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

function mapEventVideoElementToEmitter(emitter, videoEl) {
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
    videoEl.addEventListener(name, () => {
      // console.log("video:" + name);
      emitter.emit('video:' + name, arguments);
    });
  });
}
/**
 * @returns {IVideoControl}
 */
export function videoControl() {
  let videoEl = createElementVideo();
  const emitter = new TinyEmitter();

  mapEventVideoElementToEmitter(emitter, videoEl);

  function setSrc(src) {
    return new Promise((res, rej) => {
      videoEl.src = src;

      emitter.once('video:loadeddata', () => {
        res();
      });
    });
  }

  function destroy() {
    videoEl.remove();
    Object.keys(emitter.e).forEach((name) => emitter.off(name));
  }

  async function goto(time) {
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

  function control(show) {
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
