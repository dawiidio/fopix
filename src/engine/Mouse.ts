import { EventEmitter, ListenerFn } from '@dawiidio/tools/lib/browser/Event/EventEmitter/EventEmitter';
import { Vector2 } from 'three';

export class Mouse extends EventEmitter {
    public position: Vector2 = new Vector2();

    constructor(private element: HTMLElement) {
        super();
        element.addEventListener('mousemove', this.listener);
    }

    private listener = (ev: MouseEvent) => {
        const {
            top, left,
        } = this.element.getBoundingClientRect();

        this.position.x = ev.clientX - Math.round(left);
        this.position.y = ev.clientY - Math.round(top);

        this.trigger('move', this.position);
    };

    destroy() {
        this.element.removeEventListener('mousemove', this.listener);
        this.off('move');
    }

    on<E = Vector2>(eventName: 'move', listener: ListenerFn<E>): () => void;
    on<E = any>(eventName: string, listener: ListenerFn<E>): () => void {
        return super.on(eventName, listener);
    }
}
