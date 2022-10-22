import { TinyEmitter } from "tiny-emitter";

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

  function play() {
    init().then(() => {
      videoCl.play();
    });
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

export function Video(settings = {}) {
  const videoCl = videoControl();
  const emitter = new TinyEmitter();
  let initialed = false;
  const _segments = [];
  const _segmentsIndexing = {};
  let _currentSegment = 0;

  videoCl.emitter.on("video:timeupdate", () => {
    const currentTime = Math.ceil(videoCl.currentTime() * 10) / 10;
    console.log(currentTime, getCurrentSegment().timeEnd);
    if (currentTime >= getCurrentSegment().timeEnd) videoCl.pause();
  });

  const el = videoCl.getVideoEl();

  if (settings.className) {
    el.classList.add(...settings.className.split(" "));
  }
  function nextSegment() {
    return currentSegment(currentSegment() + 1);
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

  function currentSegment(value) {
    if (isNaN(value)) {
      return _currentSegment;
    }
    if (value >= _segments.length) value = _segments.length - 1;
    if (value < 0) value = 0;
    emitter.emit("segmentChange", _segments[value]);
    return (_currentSegment = value);
  }

  function on(event, callback) {
    emitter.on(event, callback);

    return () => emitter.off(event, callback);
  }

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
      })
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
    setSegmentByTime,
    prevSegment,
  };
}

function createElementVideo() {
  const videoEl = document.createElement("video");
  videoEl.setAttribute("controls", "");
  return videoEl;
}

function mapEventVideoElementToEmitter(emitter, videoEl) {
  const listEvent = [
    "loadeddata",
    "canplay",
    "canplaythrough",
    "complete",
    "durationchange",
    "emptied",
    "ended",
    "loadedmetadata",
    "pause",
    "play",
    "playing",
    "progress",
    "ratechange",
    "seeked",
    "seeking",
    "stalled",
    "suspend",
    "timeupdate",
    "volumechange",
    "waiting",
  ];

  listEvent.forEach((name) => {
    videoEl.addEventListener(name, () => {
      console.log("video:" + name);
      emitter.emit("video:" + name, arguments);
    });
  });
}

export function videoControl() {
  let videoEl = createElementVideo();
  const emitter = new TinyEmitter();

  mapEventVideoElementToEmitter(emitter, videoEl);

  function setSrc(src) {
    return new Promise((res, rej) => {
      videoEl.src = src;

      emitter.once("video:loadeddata", () => {
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
      videoEl.setAttribute("controls", "");
    } else {
      videoEl.removeAttribute("controls");
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
