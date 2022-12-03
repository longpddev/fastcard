import { run, runIdle } from '../functions/common';

type IEmitterHandleEvent = () => void;
type IEmitterObserver = {
  cb: IEmitterHandleEvent;
  ctx: any;
};
class Emitter {
  e: Record<string, Array<IEmitterObserver>> = {};
  on(evt: string, cb: IEmitterHandleEvent, ctx: any) {
    if (!(evt in this.e)) {
      this.e[evt] = [];
    }

    this.e[evt].push({
      cb,
      ctx,
    });
  }

  off(evt: string, cb: IEmitterHandleEvent) {
    let livesEvt: Array<IEmitterObserver> = [];
    const evts = this.e[evt];

    if (evts && cb) {
      livesEvt = evts.filter((observer) => observer.cb !== cb);
    }

    livesEvt.length > 0 ? (this.e[evt] = livesEvt) : delete this.e[evt];
  }

  once(evt: string, cb: IEmitterHandleEvent, ctx: any) {
    const _this = this;
    const wrapCb = function () {
      _this.off(evt, wrapCb);
      cb.apply<any, any[], void>(ctx, Array.from(arguments));
    };

    this.on(evt, wrapCb, ctx);
  }

  emit(evt: string, ...params: Array<any>) {
    if (evt in this.e) {
      this.e[evt].forEach((observer) =>
        observer.cb.apply<any, Array<any>, void>(observer.ctx, params),
      );
    }
  }
}

export default Emitter;
export const EmitterIdle = () => {
  const instance = new Emitter();
  instance.emit = runIdle<typeof Emitter.prototype.emit>(function (...args) {
    return Emitter.prototype.emit.apply<any, Array<any>, void>(instance, args);
  });
  return instance;
};
