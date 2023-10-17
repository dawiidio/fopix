import { Vector2 } from 'three';

export type ListenerFn<E = any> = (event: E) => void;

export class EventEmitter {
    private listeners: Map<string, Set<ListenerFn>> = new Map();

    on<E = any>(eventName: string, listener: ListenerFn<E>): (() => void) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, new Set());
        }

        this.listeners.get(eventName)?.add(listener);

        return () => {
            this.listeners.get(eventName)?.delete(listener);
        };
    }

    off(eventName: string, listener?: ListenerFn): void {
        if (!listener) {
            this.listeners.get(eventName)?.clear();
            return;
        }

        this.listeners.get(eventName)?.delete(listener);
    }

    trigger(eventName: string, data: any): void {
        const listeners = [...this.listeners.get(eventName)?.values() || []];

        if (listeners.length) {
            listeners.forEach(fn => fn(data));
        }
    }
}

export function getFallbackValue<T = number>(val: T | undefined, fallback: T): T {
    return typeof val === 'undefined' ? fallback : val;
}

export const translateCanvasVectorToWebglVector = (vec: Vector2, width: number, height: number) => {
    return new Vector2(
        Math.round((-width / 2) + vec.x),
        (height / 2) - vec.y,
    );
};

export const translateWebglVectorToCanvasVector = (vec: Vector2, width: number, height: number) => {
    return new Vector2(
        vec.x + (width / 2),
        (height / 2) - vec.y,
    );
};

export function normalizeVector(vec: Vector2): Vector2 {
    vec.x = Math.abs(vec.x) / (vec.x || 1);
    vec.y = (Math.abs(vec.y) / (vec.y || 1));

    return vec;
}

export function map(n: number, start1: number, stop1: number, start2: number, stop2: number, withinBounds?: boolean): number {
    const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
        return newval;
    }
    if (start2 < stop2) {
        return Math.max(Math.min(newval, stop2), start2);
    } else {
        return Math.max(Math.min(newval, start2), stop2);
    }
}
