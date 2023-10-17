import { EventEmitter, ListenerFn } from '@dawiidio/tools/lib/browser/Event/EventEmitter/EventEmitter';

export class Runner extends EventEmitter {
    private rafId?: number;
    private deltaTime: number = 0;
    private lastTime: number = 0;
    private lastOverTime: number = 0;
    private prevOverTime: number = 0;
    private readonly fpsInterval: number = 0;
    private forceStop: boolean = false;

    constructor(public readonly fps = 60) {
        super();
        this.fpsInterval = fps / 1000;
    }

    start() {
        this.forceStop = false;

        if (this.rafId !== undefined)
            return;

        const ticker = () => {
            if (this.forceStop) {
                return;
            }

            this.rafId = requestAnimationFrame((time) => {
                this.tick(time);
                ticker();
            });
        };

        ticker();
    }

    tick(time: number) {
        this.deltaTime = time - this.lastTime;

        if (this.deltaTime >= this.fpsInterval) {
            this.prevOverTime = this.lastOverTime;
            this.lastOverTime = this.deltaTime % this.fpsInterval;
            this.lastTime = time - this.lastOverTime;
            this.deltaTime -= this.prevOverTime;

            this.trigger('beforeTick', this.deltaTime);
            this.trigger('tick', this.deltaTime);
            this.trigger('afterTick', this.deltaTime);
        }
    }

    on<E = number>(eventName: 'beforeTick', listener: ListenerFn<E>): () => void;
    on<E = number>(eventName: 'tick', listener: ListenerFn<E>): () => void;
    on<E = number>(eventName: 'afterTick', listener: ListenerFn<E>): () => void;
    on<E = any>(eventName: string, listener: ListenerFn<E>): () => void {
        return super.on(eventName, listener);
    }

    stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = undefined;
            this.forceStop = true;
        }
    }
}
