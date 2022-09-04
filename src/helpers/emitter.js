import { run, runIdle } from "../functions/common";

const Emitter = function () {
  this.e = {};
};

Emitter.prototype.on = function (evt, cb, ctx) {
  if (!(evt in this.e)) {
    this.e[evt] = [];
  }

  this.e[evt].push({
    cb,
    ctx,
  });

  return this;
};
Emitter.prototype.off = function (evt, cb) {
  let livesEvt = [];
  const evts = this.e[evt];

  if (evts && cb) {
    livesEvt = evts.filter((observer) => observer.callback !== cb);
  }

  livesEvt.length > 0 ? (this.e[evt] = livesEvt) : delete this.e[evt];

  return this;
};
Emitter.prototype.once = function (evt, cb, ctx) {
  const wrapCb = () => {
    this.off(evt, wrapCb);
    cb.apply(ctx, arguments);
  };

  return this.on(evt, wrapCb, ctx);
};

Emitter.prototype.emit = function (evt, ...params) {
  if (evt in this.e) {
    this.e[evt].forEach((observer) => observer.cb.apply(observer.ctx, params));
  }

  return this;
};

export default Emitter;
export const EmitterIdle = () => {
  const instance = new Emitter();
  instance.emit = runIdle(function () {
    return Emitter.prototype.emit.apply(this, arguments);
  });
  return instance;
};
